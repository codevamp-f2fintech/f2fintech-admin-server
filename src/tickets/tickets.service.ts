import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

export interface TicketResponse {
  ticketId: number | string;
  userId: number | string;
  employeeStatus: string;
  voiceNoteUrl: string;
  forwardedTo: number | string;
  isForwarded: number | string;
  originalEstimate: string;
  applicationAmount: string | number;
  applicationTenure: number | string;
  applicationDate: Date | string;
  applicationId: number | string;
  customerId: number | string;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  customerDocuments: {
    id: number;
    type: "aadhaar front" | "aadhaar back" | "pancard" | "bank statement" | "form 16" | "payslips" | "profile" | "photo" | "certificate" | "audio";
    document_url: string;
  }[];
  customerLocation: string;
  customerDesignation: string;
  loanStatus: string;
}

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
    private readonly ticketRepository: Repository<Ticket>
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

  async findAllTickets(
    page: number,
    limit: number,
    userId?: number,
    isAgent?: boolean,
    status?: string,
    name?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<PaginationResult> {
    const skip = (page - 1) * limit; // Calculate offset for pagination

    const query = this.ticketRepository.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.application', 'application') // Join application
      .leftJoinAndSelect('application.customer', 'customer') // Join customer
      .leftJoinAndSelect('customer.info', 'info') // Join customer info
      .leftJoinAndSelect('customer.customerDocuments', 'documents') // Join customer documents
      .leftJoinAndSelect('application.loanTracking', 'loanTracking') // Join loan tracking
      .skip(skip) // Apply pagination
      .take(limit) // Limit number of results
      .orderBy('ticket.due_date', 'DESC'); // Sort by ticket due date

    // Apply filters based on parameters
    if (userId) {
      if (status === 'forwardedtome') {
        // Tickets forwarded to me
        query
          .where('ticket.is_forwarded = :isForwarded', { isForwarded: 1 })
          .andWhere('ticket.forwarded_to = :userId', { userId });
      } else if (status === 'forwardedbyme') {
        // Tickets forwarded by me
        query
          .where('ticket.is_forwarded = :isForwarded', { isForwarded: 1 })
          .andWhere('ticket.forwarded_by = :userId', { userId });
      } else {
        // All other statuses, e.g. "under credit review", "to be login", etc.
        if (status === 'forwarded') {
          // OPTIONAL: if you still want a plain "forwarded" status 
          // that means "either forwarded to me OR forwarded by me":
          query
            .where('ticket.is_forwarded = :isForwarded', { isForwarded: 1 })
            .andWhere(
              new Brackets((qb) => {
                qb.where('ticket.forwarded_to = :userId', { userId })
                  .orWhere('ticket.user_id = :userId', { userId });
              }),
            );
        }
        else {
          // Normal userId + status check
          query.where('ticket.user_id = :userId', { userId });

          if (status && status !== 'all' && status.trim() !== '') {
            query.andWhere('ticket.status = :status', { status });
          }
        }
      }
    } else if (status && status !== 'all' && status.trim() !== '') {
      // If no userId but we do have a status
      query.where('ticket.status = :status', { status });
    }


    if (name && name.trim() !== '') {
      query.andWhere('LOWER(customer.name) LIKE :name', { name: `%${name.toLowerCase()}%` });
    }
    if (startDate) {
      query.andWhere('ticket.created_at >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('ticket.created_at <= :endDate', { endDate });
    }
    // console.log(query.getSql(), query.getParameters());

    const [tickets, count] = await query.getManyAndCount();

    const results = tickets.map((ticket) => {
      const { application } = ticket;
      const { customer, loanTracking } = application;

      const customerProfileImages = customer.customerDocuments
        ?.filter((doc) => doc.type === 'profile')
        .map((doc) => doc.document_url) || [];

      return {
        ticketId: ticket.id,
        ticketStatus: ticket.status,
        user_id: ticket.user_id,
        applicationAmount: application.amount,
        applicationTenure: application.tenure,
        applicationDate: application.application_date,
        applicationId: application.id,
        customerId: customer?.id ?? 'No ID',
        customerName: customer?.name ?? 'No Name',
        customerEmail: customer?.email ?? 'No Email',
        customerContact: customer?.contact ?? 'No Contact',
        customerProfileImage: customerProfileImages.length > 0 ? customerProfileImages : 'No image available',
        customerLocation: customer.info?.city ?? 'No location available',
        loanStatus: loanTracking[0]?.status ?? 'No status available',
      };
    });

    return {
      results,
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

  async findTicketWithDetail(ticketId: number): Promise<TicketResponse> {
    const ticket = await this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.application', 'application')
      .leftJoinAndSelect('application.customer', 'customer')
      .leftJoinAndSelect('customer.info', 'info')
      .leftJoinAndSelect('customer.customerDocuments', 'documents')
      .leftJoinAndSelect('application.loanTracking', 'loanTracking')
      .where('ticket.id = :ticketId', { ticketId })
      .getOne();

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }

    const customerDocuments = ticket.application?.customer?.customerDocuments?.map(
      (doc) => ({
        id: doc.id,
        type: doc.type,
        document_url: doc.document_url,
      })
    ) ?? [];

    return {
      ticketId: ticket.id,
      userId: ticket.user_id,
      employeeStatus: ticket.status,
      voiceNoteUrl: ticket.voice_note_url,
      forwardedTo: ticket.forwarded_to,
      isForwarded: ticket.is_forwarded,
      originalEstimate: ticket.original_estimate,
      applicationAmount: ticket.application?.amount ?? 'No Amount',
      applicationTenure: ticket.application?.tenure ?? 'No Tenure',
      applicationDate: ticket.application?.application_date ?? 'No Date',
      applicationId: ticket.application?.id ?? '',
      customerId: ticket.application?.customer?.id ?? '',
      customerName: ticket.application?.customer?.name ?? 'No Name',
      customerEmail: ticket.application?.customer?.email ?? 'No Email',
      customerContact: ticket.application?.customer?.contact ?? 'No Contact',
      customerDocuments: customerDocuments,
      customerDesignation: ticket.application?.customer?.info?.occupation_type ?? 'Not available',
      customerLocation: ticket.application?.customer?.info?.city ?? 'No Location available',
      loanStatus:
        ticket.application?.loanTracking?.[0]?.status ?? '',
    };
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    console.log('updateTicketDto', updateTicketDto)
    Object.assign(ticket, updateTicketDto, { updatedAt: new Date() });
    return await this.ticketRepository.save(ticket);
  }
}
