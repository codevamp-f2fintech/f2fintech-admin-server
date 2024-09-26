import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApplicationsService {
  constructor(private readonly httpService: HttpService) {}

  async getCustomerData(
    page: number = 1,
    offset: number = 6,
    conditionObj: Record<string, any> = {},
  ): Promise<any> {
    try {
      const applicationsUrl = `http://localhost:8080/api/v1/get-applications`;

      // Fetch all applications
      let applicationsData: any;
      try {
        const applicationsResponse = await firstValueFrom(
          this.httpService.get(applicationsUrl),
        );
        applicationsData = applicationsResponse.data.data;
        if (!applicationsData || applicationsData.length === 0) {
          throw new Error('No application data found');
        }
      } catch (error) {
        console.error('Error fetching application data:', error.message);
        throw new Error('Failed to fetch application data');
      }

      console.log('Fetched Applications Data Length:', applicationsData.length);

      // Fetch all required data in parallel
      const combinedDataList = await Promise.all(
        applicationsData.map(async (application) => {
          const customerId = application.customer_id;
          const applicationId = application.id;
          if (!customerId) {
            console.error(
              `Customer ID not found for application: ${application.id}`,
            );
            return null;
          }
          try {
            // Fetch customer details, document, and location info in parallel
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

      // Filter out any null values and apply conditionObj filters
      const filteredData = combinedDataList
        .filter((data) => data !== null)
        .filter((data) => {
          if (Object.keys(conditionObj).length > 0) {
            return Object.keys(conditionObj).every((key) => {
              if (key in data) {
                return data[key]
                  .toString()
                  .toLowerCase()
                  .includes(conditionObj[key].toString().toLowerCase());
              }
              return false;
            });
          }
          return true;
        });

      console.log('Filtered Data Length:', filteredData.length);

      // Pagination logic: Calculate start and end indices
      const startIndex = (page - 1) * offset;
      const endIndex = startIndex + offset;

      // Slice the filtered data to get the paginated data
      const paginatedData = filteredData.slice(startIndex, endIndex);

      // Determine if there is more data to load
      const hasMoreData = endIndex < filteredData.length;

      console.log('Paginated Data Length:', paginatedData.length);
      console.log('Returning Data:', paginatedData);

      // Return the paginated data, total count, and if more data is available
      return {
        data: paginatedData,
        totalCount: filteredData.length,
        hasMore: hasMoreData,
      };
    } catch (error) {
      console.error('Error fetching customer data:', error.message);
      throw error;
    }
  }

  private async fetchCustomerData(customerId: string): Promise<any> {
    try {
      const customerUrl = `http://localhost:8080/api/v1/get-customer/${customerId}`;
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

  private async fetchCustomerDocument(customerId: string): Promise<any> {
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

  private async fetchCustomerInfo(customerId: string): Promise<any> {
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

  private async fetchLoanTrackingStatus(applicationId: string): Promise<any> {
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
