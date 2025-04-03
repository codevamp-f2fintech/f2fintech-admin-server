import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, Repository } from 'typeorm';

import { Status, Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(EntityManager) private readonly manager: EntityManager, // Inject the EntityManager
  ) { }

  private readonly logger = new Logger(DashboardService.name);

  async findAgentCount(): Promise<number> {
    return this.userRepository.count();
  }

  async findTicketsCount(id = null, status = null, date = null, month = null): Promise<number | { count: number, amount: number }> {
    const where: any = {};

    if (id) {
      where.user_id = id;
    }

    if (month) {
      const currentYear = new Date().getFullYear()
      const startOfMonth = new Date(`${month} 1, ${currentYear}`);
      const endOfMonth = new Date(`${month} 31, ${currentYear} `);
      where.updated_at = Between(startOfMonth, endOfMonth);
    }

    if (date) {
      const parsedDate = new Date(date);
      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));  // Set time to 00:00:00
      const endOfDay = new Date(parsedDate.setHours(28, 59, 59, 999)); // Set time to 23:59:59
      where.updated_at = Between(startOfDay, endOfDay); //  date provided
    }

    if (status) {
      if (status === 'forwarded' && id) {
        // Use query builder for OR condition
        return this.ticketRepository
          .createQueryBuilder('ticket')
          .where('ticket.status = :status', { status })
          .andWhere('ticket.user_id = :id', { id })
          .andWhere('ticket.forwarded_to IS NOT NULL')
          .getCount();
      } else {
        where.status = status;
      }
    }

    // Handling "disbursed" status to calculate total amount
    if (status === 'disbursed') {
      // Use `EntityManager` to join Ticket with Application and fetch data
      const tickets = await this.manager
        .createQueryBuilder(Ticket, 'ticket')
        .leftJoinAndSelect('ticket.application', 'application')
        .where('ticket.status = :status', { status })
        .andWhere(where)
        .getMany();

      // The sum of amounts from related applications
      const totalAmount = tickets.reduce((sum, ticket) => {
        return sum + (parseFloat(String(ticket?.application?.amount || '0')));
      }, 0);
      return { count: tickets.length, amount: totalAmount };
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

  async getTotalTicketsByMonth(
    year: number,
  ): Promise<{ month: string; count: number }[]> {
    const results = [];

    for (let month = 0; month < 12; month++) {
      const { startOfMonth, endOfMonth } = this.getMonthDateRange(year, month);

      const count = await this.ticketRepository.count({
        where: {
          created_at: Between(startOfMonth, endOfMonth),
        },
      });
      results.push({
        month: startOfMonth.toLocaleString('default', { month: 'long' }),
        count,
      });
    }
    return results;
  }

  async getDoneTicketsByMonth(
    year: number,
  ): Promise<{ month: string; count: number }[]> {
    const results = [];

    for (let month = 0; month < 12; month++) {
      const { startOfMonth, endOfMonth } = this.getMonthDateRange(year, month);

      const count = await this.ticketRepository.count({
        where: {
          status: Status.DISBURSED,
          created_at: Between(startOfMonth, endOfMonth),
        },
      });
      results.push({
        month: startOfMonth.toLocaleString('default', { month: 'long' }),
        count,
      });
    }
    return results;
  }
}
