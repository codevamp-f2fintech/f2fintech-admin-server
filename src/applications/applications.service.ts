import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApplicationsService {
  constructor(private readonly httpService: HttpService) {}

  async getCustomerData(page: number = 1, offset: number = 12): Promise<any> {
    try {
      const applicationsUrl = `http://localhost:8080/api/v1/get-applications`;

      //Fetch all applications
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
        console.error('Error fetching application data:', error.name);
        throw new Error('Failed to fetch application data');
      }

      const combinedDataList = [];
      // Loop through each application to fetch related customer data
      for (const application of applicationsData) {
        const customerId = application.customer_id;
        if (!customerId) {
          console.error(
            `Customer ID not found for application: ${application.id}`,
          );
          continue;
        }

        // Fetch customer details
        let customerData: any;
        try {
          const customerUrl = `http://localhost:8080/api/v1/get-customer/${customerId}`;
          const customerResponse = await firstValueFrom(
            this.httpService.get(customerUrl),
          );
          customerData = customerResponse.data.data;
        } catch (error) {
          console.error('Error fetching customer data:', error.message);
          continue;
        }

        // Fetch customer document (photo)
        let customerDocument: any;
        try {
          const documentUrl = `http://localhost:8080/api/v1/get-customer-document/${customerId}`;
          const documentResponse = await firstValueFrom(
            this.httpService.get(documentUrl),
          );
          customerDocument = documentResponse.data.data;
        } catch (error) {
          console.error('Error fetching customer document:', error.message);
          continue;
        }

        // Fetch customer location info
        let customerInfo: any;
        try {
          const locationUrl = `http://localhost:8080/api/v1/customer-info/${customerId}`;
          const locationResponse = await firstValueFrom(
            this.httpService.get(locationUrl),
          );
          customerInfo = locationResponse.data.data;
        } catch (error) {
          console.error('Error fetching customer location:', error.message);
          continue;
        }

        const combinedData = {
          customerData: {
            Name: customerData.name,
            Email: customerData.email,
            Contact: customerData.contact,
            Amount: application.amount,
            Tenure: application.tenure,
            Designation: customerInfo?.occupation_type || 'Not available',
            Image: customerDocument?.document_url || 'No image available',
            Location: customerInfo?.city || 'No location available',
          },
        };

        combinedDataList.push(combinedData);
      }

      return combinedDataList;
    } catch (error) {
      console.error('Error fetching customer data:', error.message);
      throw error;
    }
  }
}
