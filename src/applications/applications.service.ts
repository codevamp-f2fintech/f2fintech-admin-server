import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Application } from './entities/applications.entity';
import { UpdateApplicationDto } from './dto/update-application.dto';

export interface PaginationResult {
  results: any[];
  count: number;
  pages: number;
  errorMessage?: string;
}

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) { }

  async getApplicationData(page: number, limit: number): Promise<PaginationResult> {
    const skip = (page - 1) * limit;

    const [applications, count] = await this.applicationRepository.findAndCount({
      relations: [
        'customer',
        'customer.info',
        'customer.customerDocuments',
        'loanTracking',
      ],
      skip,
      take: limit,
      where: { is_picked: 0 },
      order: { application_date: 'DESC' },
    });

    const results = applications.map((application) => {
      const { customer, loanTracking, amount, tenure, application_date, id } = application;

      return {
        customerId: customer?.id ?? 'No ID',
        customerName: customer?.name ?? 'No Name',
        customerEmail: customer?.email ?? 'No Email',
        customerContact: customer?.contact ?? 'No Contact',
        applicationAmount: amount,
        applicationTenure: tenure,
        applicationDate: application_date,
        applicationId: id,
        loanStatus: loanTracking[0]?.status ?? 'No status available',
        customerDesignation: customer.info?.occupation_type ?? 'Not available',
        customerProfileImage: customer.customerDocuments
          ?.filter(doc => doc.type === 'profile') // Filter objects with type: 'profile'
          .map(doc => doc.document_url) ?? ['No image available'],
        customerLocation: customer.info?.city ?? 'No location available',
      };
    });

    return {
      results,
      count,
      pages: Math.ceil(count / limit),
    };
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

  async fetchCustomerDataBatch(customerIds: number[]): Promise<Record<number, any>> {
    try {
      const customerUrl = `http://localhost:8080/api/v1/get-customers`;
      const response = await firstValueFrom(
        this.httpService.post(customerUrl, { customerIds })
      );
      return response.data.data.reduce((acc, customer) => {
        acc[customer.id] = customer;
        return acc;
      }, {});
    } catch (error) {
      console.error(`Error fetching customer data batch:`, error.message);
      return {};
    }
  }

  public async fetchCustomerData(customerId: number): Promise<any> {
    try {
      const customerUrl = `http://localhost:8080/api/v1/get-customer/${customerId}`;
      const customerResponse = await firstValueFrom(
        this.httpService.get(customerUrl),
      );
      return customerResponse.data.data.reduce((acc, customer) => {
        acc[customer.id] = customer;
        return acc;
      }, {});
    } catch (error) {
      console.error(
        `Error fetching customer data for ID ${customerId}:`,
        error.message,
      );
      return null;
    }
  }

  public async fetchAllCustomerDocuments(customerId: number): Promise<any> {
    try {
      const documentUrl = `http://localhost:8080/api/v1/get-customer-documents/${customerId}`;
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

  public async fetchCustomerDocument(customerId: number): Promise<any> {
    try {
      const documentUrl = `http://localhost:8080/api/v1/get-customer-document/${customerId}`;
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

  public async fetchCustomerInfo(customerId: number): Promise<any> {
    try {
      const locationUrl = `http://localhost:8080/api/v1/customer-info/${customerId}`;
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

  public async fetchLoanTrackingStatus(applicationId: number): Promise<any> {
    try {
      const statusUrl = `http://localhost:8080/api/v1/get-loan-tracking-by-id/${applicationId}`;
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
