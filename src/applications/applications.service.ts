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
  prisma: any;
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

  async getNewApplicationsCount (): Promise<any> {
    return this.applicationRepository.count({
      where: { is_picked: 0 },
      order: { application_date: 'DESC' },
    });
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
}
