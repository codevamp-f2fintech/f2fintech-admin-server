import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketHistory } from 'src/ticket_history/entities/ticket_history.entity';
import { TicketLog } from 'src/ticket_log/entities/ticket_log.entity';
import { TicketActivity } from 'src/ticket_activities/entities/ticket_activities.entity';
import { LoanTracking } from 'src/applications/entities/loanTracking.entity';
import { Application } from 'src/applications/entities/applications.entity';
import { TicketArchive } from './entities/ticketArchive.entity';

export interface TicketResponse {
  ticketId: number | string;
  userId: number | string;
  employeeStatus: string;
  voiceNoteUrl: string;
  forwardedTo: number | string;
  isForwarded: number | string;
  originalEstimate: string;
  provider: string;
  applicationAmount: string | number;
  applicationTenure: number | string;
  applicationDate: Date | string;
  applicationId: number | string;
  customerId: number | string;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  customerDocuments: {
    id: number;
    type: "aadhaar front" | "aadhaar back" | "pancard" | "bank statement" | "form 16" | "payslips" | "profile" | "photo" | "certificate" | "audio";
    document_url: string;
  }[];
  customerLocation: string;
  customerState: string;
  customerDesignation: string;
  loanStatus: string;
}

export interface PaginationResult {
  results: any[];
  count: number;
  pages: number;
  totalDisbursedAmount?: number;
  errorMessage?: string;
}

@Injectable()
export class TicketsService {
  constructor (
    @InjectRepository( Ticket )
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository( TicketArchive )
    private readonly ticketArchiveRepository: Repository<TicketArchive>,
    @InjectRepository( TicketHistory )
    private readonly ticketHistoryRepository: Repository<TicketHistory>,
    @InjectRepository( TicketLog )
    private readonly ticketLogRepository: Repository<TicketLog>,
    @InjectRepository( TicketActivity )
    private readonly ticketActivityRepository: Repository<TicketActivity>,
    @InjectRepository( LoanTracking )
    private readonly loanTrackingRepository: Repository<LoanTracking>,
    @InjectRepository( Application )
    private readonly customerApplicationRepository: Repository<Application>,
  ) { }

  async create ( createTicketDto: CreateTicketDto ): Promise<any> {
    try
    {
      return this.ticketRepository.findOne( {
        where: { customer_application_id: createTicketDto.customer_application_id },
      } ).then( async ( existingTicket ) => {
        if ( existingTicket )
        {
          return {
            statusCode: 409,
            message: 'This Application Is Already Picked By Another User.',
          };
        } else
        {
          const newTicket = this.ticketRepository.create( createTicketDto );
          await this.ticketRepository.save( newTicket );
          return {
            statusCode: 201,
            message: 'Ticket Created Successfully',
            data: newTicket,
          };
        }
      }
      );
    } catch ( error )
    {
      return {
        statusCode: 500,
        message: 'Error Creating Ticket',
        error
      };
    }
  }

  async findAllTickets (
    page: number,
    limit: number,
    userId?: number,
    isAgent?: boolean,
    appliedBy?: number,
    status?: string,
    provider?: string,
    name?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<PaginationResult> {
    page = Number( page ) || 1;
    limit = Number( limit ) || 10;
    const skip = ( page - 1 ) * limit;

    const query = this.ticketRepository.createQueryBuilder( 'ticket' )
      .leftJoinAndSelect( 'ticket.application', 'application' ) // Join application
      .leftJoinAndSelect( 'application.customer', 'customer' ) // Join customer
      .leftJoinAndSelect( 'customer.info', 'info' ) // Join customer info
      .leftJoinAndSelect( 'customer.customerDocuments', 'documents' ) // Join customer documents
      .leftJoinAndSelect( 'application.loanTracking', 'loanTracking' ) // Join loan tracking
      .skip( skip )
      .take( limit )
      .orderBy( 'ticket.created_at', 'DESC' );

    // Apply filters based on parameters
    if ( userId )
    {
      if ( status === 'forwardedtome' )
      {
        // Tickets forwarded to me
        query
          .where( 'ticket.is_forwarded = :isForwarded', { isForwarded: 1 } )
          .andWhere( 'ticket.forwarded_to = :userId', { userId } );
      } else if ( status === 'forwardedbyme' )
      {
        // Tickets forwarded by me
        query
          .where( 'ticket.is_forwarded = :isForwarded', { isForwarded: 1 } )
          .andWhere( 'ticket.forwarded_by = :userId', { userId } );
      } else
      {
        // All other statuses, e.g. "under credit review", "to be login", etc.
        if ( status === 'forwarded' )
        {
          // OPTIONAL: if you still want a plain "forwarded" status 
          // that means "either forwarded to me OR forwarded by me":
          query
            .where( 'ticket.is_forwarded = :isForwarded', { isForwarded: 1 } )
            .andWhere(
              new Brackets( ( qb ) => {
                qb.where( 'ticket.forwarded_to = :userId', { userId } )
                  .orWhere( 'ticket.user_id = :userId', { userId } );
              } ),
            );
        }
        else
        {
          // Normal userId + status check
          query.where( 'ticket.user_id = :userId', { userId } );

          // Apply status filter if provided and not 'all'
          if ( status && status !== 'all' && status.trim() !== '' )
          {
            query.andWhere( 'ticket.status = :status', { status } );
          }
        }
      }
    } else if ( status && status !== 'all' && status.trim() !== '' )
    {
      // If no userId but we do have a status
      query.where( 'ticket.status = :status', { status } );
    }

    // Apply provider filter (works for both userId and admin)
    if ( provider && provider !== 'all' && provider.trim() !== '' )
    {
      query.andWhere( 'LOWER(application.provider) = LOWER(:provider)', { provider } );
    }

    if ( name && name.trim() !== '' )
    {
      query.andWhere(
        new Brackets( ( qb ) => {
          qb.where( 'LOWER(customer.name) LIKE :name', { name: `%${ name.toLowerCase() }%` } )
            .orWhere( 'LOWER(customer.contact) LIKE :name', { name: `%${ name.toLowerCase() }%` } )
            .orWhere( 'LOWER(info.pan) LIKE :name', { name: `%${ name.toLowerCase() }%` } )
        } ),
      );
    }

    if ( !startDate && !endDate )
    {
      // Default to current month
      query.andWhere( 'ticket.created_at >= DATE_FORMAT(NOW(), :startOfMonth)', {
        startOfMonth: '%Y-%m-01 00:00:00',
      } );
      query.andWhere( 'ticket.created_at <= DATE_FORMAT(LAST_DAY(NOW()), :endOfMonth)', {
        endOfMonth: '%Y-%m-%d 23:59:59',
      } );
    } else
    {
      // Apply provided startDate and endDate if available
      if ( startDate )
      {
        query.andWhere( 'ticket.created_at >= :startDate', { startDate } );
      }

      if ( endDate )
      {
        const endDateObj = new Date( endDate );
        endDateObj.setHours( 28, 59, 59, 999 );
        endDate = endDateObj
          .toISOString()                    // -> "2025-07-08T23:29:59.999Z"
          .replace( "T", " " )                // -> "2025-07-08 23:29:59.999Z"
          .substring( 0, 19 );                // -> "2025-07-08 23:29:59"

        query.andWhere( 'ticket.created_at <= :endDate', { endDate } );
      }
    }
    const [ tickets, count ] = await query.getManyAndCount();
    // Calculate total disbursed amount if status is 'disbursed'
    let totalDisbursedAmount = 0;
    if ( status === 'disbursed' )
    {
      totalDisbursedAmount = tickets.reduce( ( sum, ticket ) => {
        return sum + ( parseFloat( String( ticket?.application?.amount || '0' ) ) );
      }, 0 );
    }

    const results = tickets.map( ( ticket ) => {
      const { application } = ticket;
      const { customer, loanTracking } = application;

      const customerProfileImages = customer.customerDocuments
        ?.filter( ( doc ) => doc.type === 'profile' )
        .map( ( doc ) => doc.document_url ) || [];

      return {
        ticketId: ticket.id,
        ticketStatus: ticket.status,
        user_id: ticket.user_id,
        createdAt: ticket.created_at,
        applicationAmount: application.amount,
        applicationTenure: application.tenure,
        applicationDate: application.application_date,
        applicationId: application.id,
        customerId: customer?.id ?? 'No ID',
        customerName: customer?.name ?? 'No Name',
        customerEmail: customer?.email ?? 'No Email',
        customerContact: customer?.contact ?? 'No Contact',
        customerProfileImage: customerProfileImages.length > 0 ? customerProfileImages : 'No image available',
        customerLocation: customer.info?.city ?? 'No location available',
        customerState: customer.info?.state ?? 'No location available',
        loanStatus: loanTracking[ 0 ]?.status ?? 'No status available',
        applicationProvider: application.provider ?? 'No provider available',
      };
    } );

    const response: PaginationResult = {
      results,
      count,
      pages: Math.ceil( count / limit ),
    };

    if ( status === 'disbursed' )
    {
      response.totalDisbursedAmount = totalDisbursedAmount;
    }
    return response;
  }

  async findOne ( id: number ): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne( { where: { id } } );
    if ( !ticket )
    {
      throw new NotFoundException( `Ticket with ID ${ id } not found` );
    }
    return ticket;
  }

  async findTicketWithDetail ( ticketId: number ): Promise<TicketResponse> {
    const ticket = await this.ticketRepository
      .createQueryBuilder( 'ticket' )
      .leftJoinAndSelect( 'ticket.application', 'application' )
      .leftJoinAndSelect( 'application.customer', 'customer' )
      .leftJoinAndSelect( 'customer.info', 'info' )
      .leftJoinAndSelect( 'customer.customerDocuments', 'documents' )
      .leftJoinAndSelect( 'application.loanTracking', 'loanTracking' )
      .where( 'ticket.id = :ticketId', { ticketId } )
      .getOne();

    if ( !ticket )
    {
      throw new NotFoundException( `Ticket with ID ${ ticketId } not found` );
    }

    const customerDocuments = ticket.application?.customer?.customerDocuments?.map(
      ( doc ) => ( {
        id: doc.id,
        type: doc.type,
        document_url: doc.document_url,
      } )
    ) ?? [];

    return {
      ticketId: ticket.id,
      userId: ticket.user_id,
      employeeStatus: ticket.status,
      voiceNoteUrl: ticket.voice_note_url,
      forwardedTo: ticket.forwarded_to,
      isForwarded: ticket.is_forwarded,
      originalEstimate: ticket.original_estimate,
      provider: ticket.application?.provider ?? 'No Provider',
      applicationAmount: ticket.application?.amount ?? 'No Amount',
      applicationTenure: ticket.application?.tenure ?? 'No Tenure',
      applicationDate: ticket.application?.application_date ?? 'No Date',
      applicationId: ticket.application?.id ?? '',
      customerId: ticket.application?.customer?.id ?? '',
      customerName: ticket.application?.customer?.name ?? 'No Name',
      customerEmail: ticket.application?.customer?.email ?? 'No Email',
      customerContact: ticket.application?.customer?.contact ?? 'No Contact',
      customerDocuments: customerDocuments,
      customerDesignation: ticket.application?.customer?.info?.employment_type ?? 'Not available',
      customerLocation: ticket.application?.customer?.info?.city ?? 'No Location available',
      customerState: ticket.application?.customer?.info?.state ?? 'No Location available',
      loanStatus:
        ticket.application?.loanTracking?.[ 0 ]?.status ?? '',
    };
  }

  async update ( id: number, updateTicketDto: UpdateTicketDto ): Promise<Ticket> {
    const ticket = await this.findOne( id );
    Object.assign( ticket, updateTicketDto, { updatedAt: new Date() } );

    return await this.ticketRepository.save( ticket );
  }

  async remove ( ticketId: number, reason: string, archivedByUserId: number ): Promise<void> {
    const ticket = await this.ticketRepository.findOne( { where: { id: ticketId } } );
    const ticketHistory = await this.ticketHistoryRepository.find( { where: { ticket_id: ticketId } } );
    const ticketLog = await this.ticketLogRepository.find( { where: { ticket_id: ticketId } } );
    const ticketActivity = await this.ticketActivityRepository.find( { where: { ticket_id: ticketId } } );
    const loanTracking = await this.loanTrackingRepository.find( { where: { customer_application_id: ticket.customer_application_id } } );
    const customerApplication = await this.customerApplicationRepository.findOne( { where: { id: ticket.customer_application_id } } );

    if ( !ticket )
    {
      throw new Error( 'Ticket not found' );
    }

    if ( ticketHistory.length )
    {
      ticketHistory.forEach( async ( history ) => {
        await this.ticketHistoryRepository.remove( history );
      } )
    }
    if ( ticketLog.length )
    {
      ticketLog.forEach( async ( log ) => {
        await this.ticketLogRepository.remove( log );
      } )
    }
    if ( ticketActivity.length )
    {
      ticketActivity.forEach( async ( activity ) => {
        await this.ticketActivityRepository.remove( activity );
      } )
    }
    if ( loanTracking.length )
    {
      loanTracking.forEach( async ( tracking ) => {
        await this.loanTrackingRepository.remove( tracking );
      } )
    }

    // Move ticket to ticket_archive
    const archivedTicket = this.ticketArchiveRepository.create( {
      ...ticket,
      original_ticket_id: ticket.id,
      archived_at: new Date(),
      reason_to_delete: reason,
      archived_by: archivedByUserId,
    } );
    await this.ticketArchiveRepository.save( archivedTicket );

    await this.ticketRepository.remove( ticket );

    await this.customerApplicationRepository.remove( customerApplication );
  }

  // Restore Original ticket from archive
  async restoreOriginalTicket ( archiveId: number ): Promise<void> {
    const archivedTicket = await this.ticketArchiveRepository.findOneBy( { id: archiveId } );
    if ( !archivedTicket )
    {
      throw new Error( 'Archived ticket not found' );
    }

    // Create a new ticket from the archived data
    const restoredTicket = this.ticketRepository.create( {
      ...archivedTicket,
      updated_at: new Date(),
      due_date: archivedTicket.due_date,
    } );
    await this.ticketRepository.save( restoredTicket );

    await this.ticketArchiveRepository.delete( archiveId );
  }

  async findAllArchivedTickets (
    page: number,
    limit: number,
    status?: string,
    provider?: string,
    name?: string,
    startDate?: string,
    endDate?: string,
    search?: string,
  ): Promise<PaginationResult> {
    page = Number( page ) || 1;
    limit = Number( limit ) || 10;
    const skip = ( page - 1 ) * limit;

    const query = this.ticketArchiveRepository.createQueryBuilder( 'archive' )
      .leftJoinAndSelect( 'archive.application', 'application' )
      .leftJoinAndSelect( 'application.customer', 'customer' )
      .leftJoinAndSelect( 'customer.info', 'info' )
      .leftJoinAndSelect( 'customer.customerDocuments', 'documents' )
      .leftJoinAndSelect( 'application.loanTracking', 'loanTracking' )
      .skip( skip )
      .take( limit )
      .orderBy( 'archive.archived_at', 'DESC' )
      .where( '1 = 1' );

    // Filters
    if ( status && status !== 'all' && status.trim() !== '' )
    {
      query.andWhere( 'archive.status = :status', { status } );
    }

    if ( provider && provider !== 'all' && provider.trim() !== '' )
    {
      query.andWhere( 'LOWER(application.provider) = LOWER(:provider)', { provider } );
    }

    if ( name && name.trim() !== '' )
    {
      query.andWhere(
        new Brackets( ( qb ) => {
          qb.where( 'LOWER(customer.name) LIKE :name', { name: `%${ name.toLowerCase() }%` } )
            .orWhere( 'LOWER(customer.contact) LIKE :name', { name: `%${ name.toLowerCase() }%` } );
        } ),
      );
    }

    // Add search functionality
    if ( search && search.trim() !== '' )
    {
      query.andWhere(
        new Brackets( ( qb ) => {
          qb.where( 'archive.id = :searchId', { searchId: Number( search ) || 0 } )
            .orWhere( 'archive.original_ticket_id = :searchOriginalId', { searchOriginalId: Number( search ) || 0 } )
            .orWhere( 'archive.archived_by = :searchUserId', { searchUserId: Number( search ) || 0 } )
            .orWhere( 'customer.contact LIKE :searchContact', { searchContact: `%${ search }%` } )
            .orWhere( 'customer.email LIKE :searchEmail', { searchEmail: `%${ search }%` } )
            .orWhere( 'CAST(archive.id AS CHAR) LIKE :searchIdStr', { searchIdStr: `%${ search }%` } )
            .orWhere( 'CAST(archive.archived_by AS CHAR) LIKE :searchUserIdStr', { searchUserIdStr: `%${ search }%` } );

        } ),
      );
    }

    if ( !startDate && !endDate )
    {
      // Show tickets from the last 6 months by default
      query.andWhere( 'archive.archived_at >= DATE_SUB(NOW(), INTERVAL 11 MONTH)' );
    } else
    {
      // Apply provided date filters
      if ( startDate )
      {
        query.andWhere( 'archive.archived_at >= :startDate', { startDate } );
      }
      if ( endDate )
      {
        const endDateObj = new Date( endDate );
        endDateObj.setHours( 23, 59, 59, 999 );
        const formattedEndDate = endDateObj.toISOString().replace( "T", " " ).substring( 0, 19 );
        query.andWhere( 'archive.archived_at <= :endDate', { endDate: formattedEndDate } );
      }
    }

    console.log( query.getSql(), query.getParameters() );

    const [ archivedTickets, count ] = await query.getManyAndCount();

    const results = archivedTickets.map( ( archive ) => {
      const { application } = archive;
      const { customer, loanTracking } = application || {};

      const customerProfileImages = customer?.customerDocuments
        ?.filter( ( doc ) => doc.type === 'profile' )
        .map( ( doc ) => doc.document_url ) || [];

      return {
        archiveId: archive.id,
        archiveBy: archive.archived_by,
        originalTicketId: archive.original_ticket_id,
        ticketStatus: archive.status,
        user_id: archive.user_id,
        createdAt: archive.created_at,
        archivedAt: archive.archived_at,
        applicationAmount: application?.amount || 'No Amount',
        applicationTenure: application?.tenure || 'No Tenure',
        applicationDate: application?.application_date || 'No Date',
        applicationId: application?.id || '',
        customerId: customer?.id ?? 'No ID',
        customerName: customer?.name ?? 'No Name',
        customerEmail: customer?.email ?? 'No Email',
        customerContact: customer?.contact ?? 'No Contact',
        customerProfileImage: customerProfileImages.length > 0 ? customerProfileImages : 'No image available',
        customerLocation: customer?.info?.city ?? 'No location available',
        customerState: customer?.info?.state ?? 'No location available',
        loanStatus: loanTracking?.[ 0 ]?.status ?? 'No status available',
        applicationProvider: application?.provider ?? 'No provider available',
        reason: archive?.reason_to_delete,
      };
    } );

    return {
      results,
      count,
      pages: Math.ceil( count / limit ),
    };
  }


  async findArchivedTicketWithDetail ( archiveId: number ): Promise<any> {
    const archivedTicket = await this.ticketArchiveRepository
      .createQueryBuilder( 'archive' )
      .leftJoinAndSelect( 'archive.application', 'application' )
      .leftJoinAndSelect( 'application.customer', 'customer' )
      .leftJoinAndSelect( 'customer.info', 'info' )
      .leftJoinAndSelect( 'customer.customerDocuments', 'documents' )
      .leftJoinAndSelect( 'application.loanTracking', 'loanTracking' )
      .where( 'archive.id = :archiveId', { archiveId } )
      .getOne();

    if ( !archivedTicket )
    {
      throw new NotFoundException( `Archived ticket with ID ${ archiveId } not found` );
    }

    const customerDocuments = archivedTicket.application?.customer?.customerDocuments?.map(
      ( doc ) => ( {
        id: doc.id,
        type: doc.type,
        document_url: doc.document_url,
      } )
    ) ?? [];

    return {
      archiveId: archivedTicket.id,
      originalTicketId: archivedTicket.original_ticket_id,
      userId: archivedTicket.user_id,
      employeeStatus: archivedTicket.status,
      voiceNoteUrl: archivedTicket.voice_note_url,
      forwardedTo: archivedTicket.forwarded_to,
      isForwarded: archivedTicket.is_forwarded,
      originalEstimate: archivedTicket.original_estimate,
      createdAt: archivedTicket.created_at,
      archivedAt: archivedTicket.archived_at,
      provider: archivedTicket.application?.provider ?? 'No Provider',
      applicationAmount: archivedTicket.application?.amount ?? 'No Amount',
      applicationTenure: archivedTicket.application?.tenure ?? 'No Tenure',
      applicationDate: archivedTicket.application?.application_date ?? 'No Date',
      applicationId: archivedTicket.application?.id ?? '',
      customerId: archivedTicket.application?.customer?.id ?? '',
      customerName: archivedTicket.application?.customer?.name ?? 'No Name',
      customerEmail: archivedTicket.application?.customer?.email ?? 'No Email',
      customerContact: archivedTicket.application?.customer?.contact ?? 'No Contact',
      customerDocuments: customerDocuments,
      customerDesignation: archivedTicket.application?.customer?.info?.employment_type ?? 'Not available',
      customerLocation: archivedTicket.application?.customer?.info?.city ?? 'No Location available',
      customerState: archivedTicket.application?.customer?.info?.state ?? 'No Location available',
      loanStatus: archivedTicket.application?.loanTracking?.[ 0 ]?.status ?? '',
      reason: archivedTicket?.reason_to_delete,
    };
  }
}
