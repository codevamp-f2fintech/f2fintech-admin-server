import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, Repository } from 'typeorm';

import { Status, Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DashboardService {
  constructor (
    @InjectRepository( Ticket )
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    @Inject( EntityManager ) private readonly manager: EntityManager, // Inject the EntityManager
  ) { }

  private readonly logger = new Logger( DashboardService.name );

  async findAgentCount (): Promise<number> {
    return this.userRepository.count();
  }

  async findTicketsCount ( id = null, status = null, date = null, month = null ): Promise<number | { count: number, amount: number }> {
    const where: any = {};

    const qb = this.ticketRepository.createQueryBuilder( 'ticket' );
    if ( id )
    {
      const user_info = await this.userRepository.findOne( { where: { id } } );
      if ( user_info.role && user_info.role !== 'admin' && user_info.role !== 'sub admin' )
      {
        qb.innerJoin( 'users', 'user', 'user.id = ticket.user_id' )
          .where( 'user.role = :role', { role: user_info.role } );
      }
      // where.user_id = id;
    }

    if ( month )
    {
      // Use the same reliable month calculation as getTotalTicketsByMonth
      const monthNames = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];
      const monthIndex = monthNames.indexOf( month );
      if ( monthIndex === -1 )
      {
        throw new Error( 'Invalid month name' );
      }

      const currentYear = new Date().getFullYear();
      const startOfMonth = new Date( currentYear, monthIndex, 1, 0, 0, 0 );
      const endOfMonth = new Date( currentYear, monthIndex + 1, 0, 23, 59, 59 );

      qb.andWhere( 'ticket.created_at BETWEEN :start AND :end', {
        start: startOfMonth,
        end: endOfMonth,
      } );
    }

    if ( date )
    {
      // Assuming DD/MM/YYYY format
      const [ year, month, day ] = date.split( '-' );
      const parsedDate = new Date( year, month - 1, day ); // month is 0-indexed

      const startOfDay = new Date( parsedDate );
      startOfDay.setHours( 0, 0, 0, 0 );

      const endOfDay = new Date( parsedDate );
      endOfDay.setHours( 23, 59, 59, 999 );

      qb.andWhere( 'ticket.created_at BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      } );

      // where.created_at = Between( startOfDay, endOfDay );
    }

    if ( status )
    {
      if ( status === 'forwarded' && id )
      {
        // Use query builder for OR condition
        return this.ticketRepository
          .createQueryBuilder( 'ticket' )
          .where( 'ticket.status = :status', { status } )
          .andWhere( 'ticket.user_id = :id', { id } )
          .andWhere( 'ticket.forwarded_to IS NOT NULL' )
          .getCount();
      } else
      {
        qb.andWhere( 'ticket.status = :status', { status: status } );
        // where.status = status;
      }
    }

    // Handling "disbursed" status to calculate total amount
    if ( status === 'disbursed' || status === 'approved' )
    {
      // Use `EntityManager` to join Ticket with Application and fetch data
      const tickets = await qb.leftJoinAndSelect( 'ticket.application', 'application' )
        .getMany();
      const [ sql, parameters ] = qb.getQueryAndParameters();
      console.log( "SQL:", sql );
      console.log( "Parameters:", parameters );

      // The sum of amounts from related applications
      const totalAmount = tickets.reduce( ( sum, ticket ) => {
        return sum + ( parseFloat( String( ticket?.application?.amount || '0' ) ) );
      }, 0 );
      return { count: tickets.length, amount: totalAmount };
    }
    const [ sql, parameters ] = qb.getQueryAndParameters();
    console.log( "SQL:", sql );
    console.log( "Parameters:", parameters );
    // Return count based on the conditions in 'where'
    return qb.getCount();
  }

  // Helper function to generate start and end of month dates
  private getMonthDateRange ( year: number, month: number ) {
    const startOfMonth = new Date( year, month, 1, 0, 0, 0 );
    const endOfMonth = new Date( year, month + 1, 0, 23, 59, 59 );

    // this.logger.debug(`Date range for month ${month + 1}: ${startOfMonth} to ${endOfMonth}`);
    return { startOfMonth, endOfMonth };
  }

  async getTotalTicketsByMonth (
    year: number,
  ): Promise<{ month: string; count: number }[]> {
    const results = [];

    for ( let month = 0; month < 12; month++ )
    {
      const { startOfMonth, endOfMonth } = this.getMonthDateRange( year, month );

      const count = await this.ticketRepository.count( {
        where: {
          created_at: Between( startOfMonth, endOfMonth ),
        },
      } );
      results.push( {
        month: startOfMonth.toLocaleString( 'default', { month: 'long' } ),
        count,
      } );
    }
    return results;
  }

  async getDoneTicketsByMonth (
    year: number,
  ): Promise<{ month: string; count: number }[]> {
    const results = [];

    for ( let month = 0; month < 12; month++ )
    {
      const { startOfMonth, endOfMonth } = this.getMonthDateRange( year, month );

      const count = await this.ticketRepository.count( {
        where: {
          status: Status.DISBURSED,
          created_at: Between( startOfMonth, endOfMonth ),
        },
      } );
      results.push( {
        month: startOfMonth.toLocaleString( 'default', { month: 'long' } ),
        count,
      } );
    }
    return results;
  }
}
