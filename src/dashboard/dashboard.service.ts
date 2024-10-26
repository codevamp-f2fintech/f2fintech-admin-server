import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) { }

  async findAgentCount(): Promise<number> {
    return this.userRepository.count();
  }

  async findTicketsCount(id = null, status = null): Promise<number> {
    const where: any = {};

    if (id) {
      where.user_id = id;
    }
    if (status) {
      where.status = status;
    }

    // Return count based on the conditions in 'where'
    return this.ticketRepository.count({ where });
  }
}
