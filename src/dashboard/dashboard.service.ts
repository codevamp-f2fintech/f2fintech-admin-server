import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Status, Ticket } from 'src/tickets/entities/ticket.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) { }

  private readonly logger = new Logger(DashboardService.name);

  async findAgentCount(): Promise<number> {
    return this.userRepository.count();
  }

  async findTicketsCount(id = null, status = null): Promise<number> {
    const where: any = {};

    if (id) {
      where.user_id = id;
    }
    if (status) {
      if (status === "forwarded" && id) {
        // Use query builder for OR condition
        return this.ticketRepository
          .createQueryBuilder('ticket')
          .where('ticket.status = :status', { status })
          .andWhere('ticket.forwarded_to = :id', { id })
          .getCount();
      } else {
        where.status = status;
      }
    }

    // Return count based on the conditions in 'where'
    return this.ticketRepository.count({ where });
  }

  // Helper function to generate start and end of month dates
  private getMonthDateRange(year: number, month: number) {
    const startOfMonth = new Date(year, month, 1, 0, 0, 0);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    // this.logger.debug(`Date range for month ${month + 1}: ${startOfMonth} to ${endOfMonth}`);
    return { startOfMonth, endOfMonth };
  }

  async getTotalTicketsByMonth(year: number): Promise<{ month: string; count: number }[]> {
    const results = [];

    for (let month = 0; month < 12; month++) {
      const { startOfMonth, endOfMonth } = this.getMonthDateRange(year, month);

      const count = await this.ticketRepository.count({
        where: {
          created_at: Between(startOfMonth, endOfMonth),
        },
      });
      results.push({ month: startOfMonth.toLocaleString('default', { month: 'long' }), count });
    }
    return results;
  }

  async getDoneTicketsByMonth(year: number): Promise<{ month: string; count: number }[]> {
    const results = [];

    for (let month = 0; month < 12; month++) {
      const { startOfMonth, endOfMonth } = this.getMonthDateRange(year, month);

      const count = await this.ticketRepository.count({
        where: {
          status: Status.DONE,
          created_at: Between(startOfMonth, endOfMonth),
        },
      });
      results.push({ month: startOfMonth.toLocaleString('default', { month: 'long' }), count });
    }
    return results;
  }
}
