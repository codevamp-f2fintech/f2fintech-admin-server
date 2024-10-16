import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTicketHistoryDto } from './dto/create-ticket_history.dto';
// import { UpdateTicketHistoryDto } from './dto/update-ticket_history.dto';
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
    });
  }

  // async update(
  //   id: number,
  //   updateTicketHistoryDto: UpdateTicketHistoryDto,
  // ): Promise<TicketHistory> {
  //   const activity = await this.findOne(id);
  //   Object.assign(activity, updateTicketHistoryDto);
  //   return await this.ticketHistoryRepository.save(activity);
  // }
}
