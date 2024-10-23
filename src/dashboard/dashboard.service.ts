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
  ) {}

  async findAgentCount(): Promise<number> {
    return this.userRepository.count();
  }

  async findTicketsCount(id = null, status = null): Promise<number> {
    if (id || status) {
      let where = {};
      if (status) {
        where = {
          ...where,
          status: status,
        };
      }
      if (id) {
        where = {
          ...where,
          user_id: id,
        };
      }

      console.log('where', where);

      //it will give count as per status
      return this.ticketRepository.count({
        where: where,
      });
    } else {
      // it will give total Tickets count
      return this.ticketRepository.count();
    }
  }
}
