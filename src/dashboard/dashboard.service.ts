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

  async findAgentCount ( companyId: number = null ): Promise<number> {
    const where: any = {};

    // Add company filter if companyId is provided
    if ( companyId )
    {
      where.companyId = companyId;
    }

    return this.userRepository.count( { where } );
  }

  async findTicketsCount ( id = null, status = null, date = null, month = null, year = null, companyId = null ): Promise<number | { count: number, amount: number }> {
    const where: any = {};
    const qb = this.ticketRepository.createQueryBuilder( 'ticket' );

    // Add companyId filter if provided
    if ( companyId )
    {
      qb.andWhere( 'ticket.company_id = :companyId', { companyId } );
    }

    if ( id )
    {
      const user_info = await this.userRepository.findOne( { where: { id } } );

      if ( user_info.role && user_info.role !== 'admin' && user_info.role !== 'sub admin' )
      {
        if ( user_info.role === 'sales' )
        {
          // For sales users, join with application and filter by applied_by
          qb.leftJoinAndSelect( 'ticket.application', 'application' )
            .where( 'application.applied_by = :userId', { userId: id } );
        }
        else
        {
          qb.leftJoinAndSelect( 'users', 'user', 'user.id = ticket.user_id' )
            .where( 'user.role = :role', { role: user_info.role } );

          // Add company filter for other roles if companyId is provided
          if ( companyId )
          {
            qb.andWhere( 'ticket.company_id = :companyId', { companyId } );
          }
        }
      }
    }

    // ✅ Year filter (if provided and month is empty)
    if ( year && !month )
    {
      const startOfYear = new Date( Number( year ), 0, 1, 0, 0, 0 );
      const endOfYear = new Date( Number( year ), 11, 31, 23, 59, 59 );

      if ( status === 'disbursed' )
      {
        qb.andWhere( 'ticket.disbursed_at BETWEEN :start AND :end', {
          start: startOfYear,
          end: endOfYear,
        } );
      }
      else
      {
        qb.andWhere( 'ticket.created_at BETWEEN :start AND :end', {
          start: startOfYear,
          end: endOfYear,
        } );
      }
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

      if ( status === 'disbursed' )
      {
        qb.andWhere( 'ticket.disbursed_at BETWEEN :start AND :end', {
          start: startOfMonth,
          end: endOfMonth,
        } );
      }
      else
      {
        qb.andWhere( 'ticket.created_at BETWEEN :start AND :end', {
          start: startOfMonth,
          end: endOfMonth,
        } );
      }
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

      if ( status === 'disbursed' )
      {
        qb.andWhere( 'DATE(ticket.disbursed_at) = :date', {
          date: date
        } );
        const [ sql, params ] = qb.getQueryAndParameters();
        console.log( "Final SQL:", sql, params );
      }
      else
      {
        qb.andWhere( 'ticket.created_at BETWEEN :start AND :end', {
          start: startOfDay,
          end: endOfDay,
        } );
      }
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
          .andWhere( companyId ? 'ticket.company_id = :companyId' : '1=1', companyId ? { companyId } : {} )
          .getCount();
      } else
      {
        qb.andWhere( 'ticket.status = :status', { status: status } );
      }
    }

    // Handling "disbursed" status to calculate total amount
    if ( status === 'disbursed' || status === 'approved' )
    {
      // Make sure application is joined for amount calculation
      if ( !qb.expressionMap.joinAttributes.find( join => join.alias.name === 'application' ) )
      {
        qb.leftJoinAndSelect( 'ticket.application', 'application' );
      }

      const tickets = await qb.getMany();

      // The sum of amounts from related applications
      const totalAmount = tickets.reduce( ( sum, ticket ) => {
        let amount = 0;

        if ( status === 'disbursed' )
        {
          // For disbursed tickets, use disbursed_amount
          amount = parseFloat( String( ticket?.disbursed_amount || '0' ) );
        } else if ( status === 'approved' )
        {
          // For approved tickets, use application amount
          amount = parseFloat( String( ticket?.approved_amount || '0' ) );
        }

        return sum + amount;
      }, 0 );

      return { count: tickets.length, amount: totalAmount };
    }

    // const [ sql, parameters ] = qb.getQueryAndParameters();
    // console.log( "SQL:", sql );
    // console.log( "Parameters:", parameters );

    // Return count based on the conditions
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
    companyId: number = null
  ): Promise<{ month: string; count: number }[]> {
    const results = [];

    for ( let month = 0; month < 12; month++ )
    {
      const { startOfMonth, endOfMonth } = this.getMonthDateRange( year, month );

      const where: any = {
        created_at: Between( startOfMonth, endOfMonth ),
      };

      // Add company filter if companyId is provided
      if ( companyId )
      {
        where.companyId = companyId;
      }

      const count = await this.ticketRepository.count( { where } );
      results.push( {
        month: startOfMonth.toLocaleString( 'default', { month: 'long' } ),
        count,
      } );
    }
    return results;
  }

  async getDoneTicketsByMonth (
    year: number,
    companyId: number = null
  ): Promise<{ month: string; count: number }[]> {
    const results = [];

    for ( let month = 0; month < 12; month++ )
    {
      const { startOfMonth, endOfMonth } = this.getMonthDateRange( year, month );

      const where: any = {
        status: Status.DISBURSED,
        disbursed_at: Between( startOfMonth, endOfMonth ),
      };

      // Add company filter if companyId is provided
      if ( companyId )
      {
        where.companyId = companyId;
      }

      const count = await this.ticketRepository.count( { where } );
      results.push( {
        month: startOfMonth.toLocaleString( 'default', { month: 'long' } ),
        count,
      } );
    }
    return results;
  }
}
