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
  ) {}

  async create(createUserDto: CreateTicketDto): Promise<Ticket> {
    const newTicket = this.ticketRepository.create(createUserDto);
    return await this.ticketRepository.save(newTicket);
  }

  async findAllByUserId(userId?: number, isAgent?: boolean, status?: string) {
    if (!userId) {
      // If no userId is provided, return all tickets
      return await this.ticketRepository.find({
        where: {
          status: status as Status, // Add your condition here
        },
      });
    }

    const query = this.ticketRepository.createQueryBuilder('ticket');
    // Exclude Tickets where the current agent has forwarded them
    if (isAgent) {
      if (status === 'forwarded') {
        query
          .where('ticket.forwarded_to = :userId', { userId })
          .andWhere('ticket.status = :status', { status });
      } else {
        query
          .where('ticket.user_id = :userId', { userId })
          .andWhere('ticket.status = :status', { status });
      }
    } else {
      if (status === 'forwarded') {
        query
          .where('ticket.forwarded_to = :userId', { userId })
          .andWhere('ticket.status = :status', { status });
      } else {
        query
          .where('ticket.user_id = :userId', { userId })
          .andWhere('ticket.status = :status', { status });
      }
    }
    return await query.getMany();
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
