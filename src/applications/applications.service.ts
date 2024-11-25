import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Application } from './entities/applications.entity';
import { UpdateApplicationDto } from './dto/update-application.dto';

export interface PaginationResult<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  errorMessage?: string;
}

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async getApplicationData(
    page: number,
    limit: number,
  ): Promise<{
    results: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      // Fetch total count of applications
      const total = await this.applicationRepository.count({
        where: {
          is_picked: 0, // Count applications where is_picked is 0
        },
      });
      if (total === 0) {
        return {
          results: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }
      // Fetch paginated applications
      const applicationsResponse = await this.applicationRepository.find({
        where: { is_picked: 0 },
        skip,
        take: limit,
        order: { last_updated: 'DESC' }, // Sort by last_updated field in descending order
      });

      // Map and process application details
      const results = await Promise.all(
        applicationsResponse.map(async (application) => {
          const customerId = application.customer_id;
          const applicationId = application.id;

          if (!customerId) {
            console.error(
              `Customer ID not found for application: ${application.id}`,
            );
            return null;
          }

          try {
            const [
              customerData,
              customerDocument,
              customerInfo,
              customerLoanStatus,
            ] = await Promise.all([
              this.fetchCustomerData(customerId),
              this.fetchCustomerDocument(customerId),
              this.fetchCustomerInfo(customerId),
              this.fetchLoanTrackingStatus(applicationId),
            ]);

            return {
              Id: customerData?.id ?? 'No ID',
              Name: customerData?.name ?? 'No Name',
              Email: customerData?.email ?? 'No Email',
              Contact: customerData?.contact ?? 'No Contact',
              Amount: application.amount,
              Tenure: application.tenure,
              applicationDate: application.application_date,
              applicationId: application.id,
              status: customerLoanStatus?.status ?? 'No status available',
              Designation: customerInfo?.occupation_type ?? 'Not available',
              Image: customerDocument?.document_url ?? 'No image available',
              Location: customerInfo?.city ?? 'No location available',
            };
          } catch (error) {
            console.error(
              `Error fetching details for application ${applicationId}:`,
              error.message,
            );
            return null;
          }
        }),
      );

      // Filter out null results
      const filteredResults = results.filter((data) => data !== null);
      return {
        results: filteredResults,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error(
        'Error fetching paginated application data:',
        error.message,
      );
      throw error;
    }
  }

  async getApplicationsAsTickets(applicationId: string): Promise<any> {
    if (!applicationId) {
      console.log(`Application ID not provided`);
      return null;
    }
    const applicationsUrl = `https://web.f2fintech.in/api/v1/get-applications/${applicationId}`;
    console.log(`Fetching applications from URL: ${applicationsUrl}`);

    try {
      const applicationsResponse = await firstValueFrom(
        this.httpService.get(applicationsUrl),
      );
      console.log('Applications Response:', applicationsResponse.data);
      const applicationsData = applicationsResponse.data.data;

      if (!applicationsData || applicationsData.length === 0) {
        throw new Error(`No application data found ${applicationsUrl} ${applicationsData}`);
      }

      console.log('Fetched Applications Data Length:', applicationsData.length);

      const combinedDataList = await Promise.all(
        applicationsData.map(async (application) => {
          const customerId = application.customer_id;
          if (!customerId) {
            console.error(
              `Customer ID not found for application: ${application.id}`,
            );
            return null;
          }

          const [
            customerData,
            customerDocument,
            customerInfo,
            customerLoanStatus,
          ] = await Promise.all([
            this.fetchCustomerData(customerId),
            this.fetchCustomerDocument(customerId),
            this.fetchCustomerInfo(customerId),
            this.fetchLoanTrackingStatus(application.id),
          ]);

          return {
            Id: customerData?.id ?? 'No ID',
            Name: customerData?.name ?? 'No Name',
            Email: customerData?.email ?? 'No Email',
            Contact: customerData?.contact ?? 'No Contact',
            Amount: application.amount,
            Tenure: application.tenure,
            applicationDate: application.application_date,
            applicationId: application.id,
            status: customerLoanStatus?.status ?? 'No status available',
            Designation: customerInfo?.occupation_type ?? 'Not available',
            Image: customerDocument?.document_url ?? 'No image available',
            Location: customerInfo?.city ?? 'No location available',
          };
        }),
      );

      return combinedDataList.filter((item) => item !== null);
    } catch (error) {
      // console.error(`An Error Occurred in getApplicationsAsTickets:`, error);
      console.error(`Error Details: ${error.response ? error.response.data : error.message}`);
      // throw new Error('Failed to fetch applications as tickets');
    }
  }

  async getApplicationsCount(): Promise<any> {
    return this.applicationRepository.count();
  }

  async getCustomerStatusAndDocuments(
    customerId: number,
    applicationId: number,
  ): Promise<any> {
    try {
      if (!customerId || !applicationId) {
        return null;
      }

      try {
        // Fetch customer details and loan status in parallel
        const [customerDocuments, customerLoanStatus] = await Promise.all([
          this.fetchAllCustomerDocuments(customerId),
          this.fetchLoanTrackingStatus(applicationId),
        ]);

        return {
          loanStatus: customerLoanStatus?.status ?? 'No status available',
          documents:
            customerDocuments.length > 0
              ? customerDocuments
              : 'No documents available',
          success: true
        };
      } catch (error) {
        console.error(`Error fetching details:`, error.message);
        return null;
      }
    } catch (error) {
      console.error('An Error Occurred', error.message);
      throw error;
    }
  }

  // Update an existing loan application
  async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    Object.assign(application, updateApplicationDto);

    return this.applicationRepository.save(application); // Save updated entity to the database
  }

  private async fetchCustomerData(customerId: number): Promise<any> {
    try {
      const customerUrl = `https://web.f2fintech.in/api/v1/get-customer/${customerId}`;
      const customerResponse = await firstValueFrom(
        this.httpService.get(customerUrl),
      );
      return customerResponse.data.data;
    } catch (error) {
      console.error(
        `Error fetching customer data for ID ${customerId}:`,
        error.message,
      );
      return null;
    }
  }

  private async fetchAllCustomerDocuments(customerId: number): Promise<any> {
    try {
      const documentUrl = `https://web.f2fintech.in/api/v1/get-customer-documents/${customerId}`;
      const documentResponse = await firstValueFrom(
        this.httpService.get(documentUrl),
      );

      return documentResponse.data.data;
    } catch (error) {
      console.error(
        `Error fetching customer document for ID ${customerId}:`,
        error.message,
      );

      return null;
    }
  }

  private async fetchCustomerDocument(customerId: number): Promise<any> {
    try {
      const documentUrl = `https://web.f2fintech.in/api/v1/get-customer-document/${customerId}`;
      const documentResponse = await firstValueFrom(
        this.httpService.get(documentUrl),
      );
      return documentResponse.data.data;
    } catch (error) {
      console.error(
        `Error fetching customer document for ID ${customerId}:`,
        error.message,
      );
      return null;
    }
  }

  private async fetchCustomerInfo(customerId: number): Promise<any> {
    try {
      const locationUrl = `https://web.f2fintech.in/api/v1/customer-info/${customerId}`;
      const locationResponse = await firstValueFrom(
        this.httpService.get(locationUrl),
      );
      return locationResponse.data.data;
    } catch (error) {
      console.error(
        `Error fetching customer info for ID ${customerId}:`,
        error.message,
      );
      return null;
    }
  }

  private async fetchLoanTrackingStatus(applicationId: number): Promise<any> {
    try {
      const statusUrl = `https://web.f2fintech.in/api/v1/get-loan-tracking-by-id/${applicationId}`;
      const statusResponse = await firstValueFrom(
        this.httpService.get(statusUrl),
      );
      return statusResponse.data.data;
    } catch (error) {
      console.error(
        `Error fetching loan tracking status for application ID ${applicationId}:`,
        error.message,
      );
      return null;
    }
  }
}
