import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTicketHistoryDto } from './dto/create-ticket_history.dto';
import { TicketHistory } from './entities/ticket_history.entity';

@Injectable()
export class TicketHistoryService {
  constructor(
    @InjectRepository(TicketHistory)
    private readonly ticketHistoryRepository: Repository<TicketHistory>,
  ) { }

  async create(
    createTicketHistoryDto: CreateTicketHistoryDto
  ): Promise<TicketHistory> {
    const newTicketHistory = this.ticketHistoryRepository.create(createTicketHistoryDto);
    return await this.ticketHistoryRepository.save(newTicketHistory);
  }

  async findAllByTicketId(ticketId: number) {
    return await this.ticketHistoryRepository.find({
      where: { ticket_id: ticketId },
      order: { created_at: 'DESC' }
    });
  }
}
