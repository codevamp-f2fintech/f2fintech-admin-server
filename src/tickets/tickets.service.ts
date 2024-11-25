import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

export enum Status {
  TO_DO = 'to do',
  IN_PROGRESS = 'in progress',
  ON_HOLD = 'on hold',
  DONE = 'done',
  CLOSE = 'close',
}

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) { }

  async create(createUserDto: CreateTicketDto): Promise<Ticket> {
    const newTicket = this.ticketRepository.create(createUserDto);
    return await this.ticketRepository.save(newTicket);
  }

  async findAllByUserId(
    page: number,
    limit: number,
    userId?: number,
    isAgent?: boolean,
    status?: string,
  ): Promise<{
    results: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit; // Calculate offset for pagination
    const query = this.ticketRepository.createQueryBuilder('ticket');

    // Apply filters based on parameters
    if (userId) {
      if (status === 'forwarded') {
        query.where('ticket.forwarded_to = :userId', { userId })
          .andWhere('ticket.status = :status', { status });
      } else {
        query.where('ticket.user_id = :userId', { userId });
        if (status && status !== 'all' && status.trim() !== '') {   // Only add status if valid
          query.andWhere('ticket.status = :status', { status });
        }
      }
    } else if (status && status !== 'all' && status.trim() !== '') {   // General status filter
      query.where('ticket.status = :status', { status });
    }

    // Apply pagination
    query.skip(skip).take(limit);

    // Log the generated SQL query and parameters
    // console.log(query.getSql(), query.getParameters());
    // Execute queries for results and total count
    const [results, total] = await Promise.all([
      query.getMany(),
      query.getCount(),
    ]);

    return {
      results, // The paginated results
      total, // The total number of matching tickets
      page, // Current page
      limit, // Limit per page
      totalPages: Math.ceil(total / limit), // Calculate total pages
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
