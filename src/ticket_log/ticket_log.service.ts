import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTicketLogDto } from './dto/create-ticket_log.dto';
import { TicketLog } from './entities/ticket_log.entity';

@Injectable()
export class TicketLogService {
  constructor(
    @InjectRepository(TicketLog)
    private readonly ticketLogRepository: Repository<TicketLog>,
  ) { }

  async create(
    createTicketLogDto: CreateTicketLogDto
  ): Promise<TicketLog> {
    const newTicketLog = this.ticketLogRepository.create(createTicketLogDto);
    return await this.ticketLogRepository.save(newTicketLog);
  }

  async findAllByTicketId(ticketId: number) {
    return await this.ticketLogRepository.find({
      where: { ticket_id: ticketId },
      order: { created_at: 'DESC' }
    });
  }
}
