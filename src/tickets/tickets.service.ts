import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { ApplicationsService } from 'src/applications/applications.service';

export interface PaginationResult {
  results: any[];
  count: number;
  pages: number;
  errorMessage?: string;
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly applicationsService: ApplicationsService
  ) { }

  async create(createTicketDto: CreateTicketDto): Promise<any> {
    try {
      const newTicket = this.ticketRepository.create(createTicketDto);
      await this.ticketRepository.save(newTicket);
      return {
        statusCode: 201,
        message: 'Created Successfully',
        data: newTicket,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error Creating Ticket',
        error
      };
    }
  }

  async findAllByUserId(
    page: number,
    limit: number,
    userId?: number,
    isAgent?: boolean,
    status?: string,
  ): Promise<PaginationResult> {
    const skip = (page - 1) * limit; // Calculate offset for pagination
    const query = this.ticketRepository.createQueryBuilder('ticket');

    // Apply filters based on parameters
    if (userId) {
      if (status === 'forwarded') {
        query
          .where('ticket.is_forwarded = 1')
          .andWhere(new Brackets((qb) => {
            qb.where('ticket.forwarded_to = :userId', { userId })
              .orWhere('ticket.user_id = :userId', { userId });
          }));
      } else {
        query.where('ticket.user_id = :userId', { userId });
        if (status && status !== 'all' && status.trim() !== '') {   // Only add status if valid
          query.andWhere('ticket.status = :status', { status });
        }
      }
    } else if (status && status !== 'all' && status.trim() !== '') {   // General status filter
      query.where('ticket.status = :status', { status });
    }

    // Join with Application table
    query.leftJoinAndSelect('ticket.application', 'application');

    // Apply pagination
    query.skip(skip).take(limit);

    // Log the generated SQL query and parameters
    // console.log(query.getSql(), query.getParameters());
    // Execute queries for results and total count
    const [results, count] = await Promise.all([
      query.getMany(),
      query.getCount(),
    ]);

    // Now fetch customer-related data for each ticket's application
    const resultsWithCustomerData = await Promise.all(
      results.map(async (ticket) => {
        const customerId = ticket.application.customer_id;
        // join customer, customer_info and customer_document tables so no need of loop
        // folder of customer entities

        // Fetch customer data, documents, info, and loan status from ApplicationsService
        const [
          customerData,
          customerDocument,
          customerInfo,
        ] = await Promise.all([
          this.applicationsService.fetchCustomerData(customerId),
          this.applicationsService.fetchCustomerDocument(customerId),
          this.applicationsService.fetchCustomerInfo(customerId),
        ]);

        return {
          ticketId: ticket.id,
          ticketStatus: ticket.status,
          Amount: ticket.application.amount,
          Tenure: ticket.application.tenure,
          applicationDate: ticket.application.application_date,
          customer_application_id: ticket.application.id,
          Id: customerData?.id ?? 'No ID',
          Name: customerData?.name ?? 'No Name',
          Email: customerData?.email ?? 'No Email',
          Contact: customerData?.contact ?? 'No Contact',
          Image: customerDocument?.document_url ?? 'No image available',
          Location: customerInfo?.city ?? 'No location available'
        };
      }),
    );

    return {
      results: resultsWithCustomerData,
      count,
      pages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async findByApplicationId(applicationId: number): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { customer_application_id: applicationId },
    });
    if (!ticket) {
      throw new NotFoundException(
        `Ticket with applicationId ${applicationId} not found`,
      );
    }
    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    Object.assign(ticket, updateTicketDto, { updatedAt: new Date() });
    return await this.ticketRepository.save(ticket);
  }
}
