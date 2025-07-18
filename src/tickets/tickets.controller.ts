import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';

import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller( 'api/v1' )
@UseGuards( RolesGuard )
export class TicketsController {
  constructor ( private readonly ticketsService: TicketsService ) { }

  @Post( 'create-ticket' )
  async create ( @Body() createTicketDto: CreateTicketDto ) {
    try
    {
      const newTicket = await this.ticketsService.create( createTicketDto );
      return ResponseFormatter.success(
        201,
        'Ticket created successfully',
        newTicket,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get( 'get-all-tickets/:userId?' )
  async findAllTickets (
    @Query( 'page' ) page: number,
    @Query( 'limit' ) limit: number,
    @Param( 'userId' ) userId?: number,
    @Query( 'isAgent' ) isAgent: boolean = false,
    @Query( 'appliedBy' ) appliedBy?: number,
    @Query( 'status' ) status: string = '',
    @Query( 'provider' ) provider: string = '',
    @Query( 'name' ) name: string = '',
    @Query( 'startDate' ) startDate: string = '',
    @Query( 'endDate' ) endDate: string = '',
  ): Promise<any> {
    const paginatedTickets = await this.ticketsService.findAllTickets(
      page,
      limit,
      userId,
      isAgent,
      appliedBy,
      status,
      provider,
      name,
      startDate,
      endDate,
    );
    return ResponseFormatter.success( 200, 'Tickets Retrieved Successfully', paginatedTickets );
  }

  @Get( 'get-ticket/:ticketId' )
  async findOne ( @Param( 'ticketId' ) ticketId: string ) {
    try
    {
      const ticket = await this.ticketsService.findOne( +ticketId );
      return ResponseFormatter.success(
        200,
        'Ticket retrieved successfully',
        ticket,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 404,
        error.message || 'Ticket not found',
      );
    }
  }

  @Get( 'get-ticket-with-detail/:ticketId' )
  async findTicketWithDetail ( @Param( 'ticketId' ) ticketId: number ) {
    const ticket = await this.ticketsService.findTicketWithDetail( +ticketId );
    return ResponseFormatter.success( 200, 'Ticket with Details retrieved successfully', ticket );
  }

  @Patch( 'update-ticket/:ticketId' )
  async update (
    @Param( 'ticketId' ) ticketId: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    try
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updatedTicket = await this.ticketsService.update(
        +ticketId,
        updateTicketDto,
      );
      return ResponseFormatter.success( 200, 'Ticket updated successfully' );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
  @Post( 'delete-ticket/:ticketId' ) // Add this endpoint
  async remove (
    @Param( 'ticketId' ) ticketId: number,
    @Body() body: { ticketId: number,reason: string, archivedBy: number },
  ) {
    try
    {
      console.log( "Body>>", body )
      // Validate the ticketId before proceeding
      if ( !ticketId || isNaN( ticketId ) )
      {
        throw new Error( 'Invalid ticket ID' );
      }

      if ( !body.reason || body.reason.trim() === '' )
      {
        throw new Error( 'Reason for deletion is required' );
      }
      const deletingReason = body.reason.trim()
      const archivedBy = body.archivedBy

      // Call the service to delete the ticket
      await this.ticketsService.remove( ticketId, deletingReason, archivedBy );
      

      return ResponseFormatter.success( 200, 'Ticket deleted successfully' );
    } catch ( error )
    {
      console.error( 'Error deleting ticket:', error ); // Log error for debugging
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Post( 'restore-original-ticket/:archiveId' )
  async restoreOriginalTicket ( @Param( 'archiveId' ) archiveId: number ) {
    try
    {
      const newTicket = await this.ticketsService.restoreOriginalTicket( archiveId );
      return ResponseFormatter.success(
        201,
        'Ticket restored successfully',
        newTicket,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }


  @Get( 'get-all-archived-tickets?' )
  async findAllArchivedTickets (
    @Query( 'page' ) page: number,
    @Query( 'limit' ) limit: number,
    @Query( 'status' ) status: string = '',
    @Query( 'provider' ) provider: string = '',
    @Query( 'name' ) name: string = '',
    @Query( 'startDate' ) startDate: string = '',
    @Query( 'endDate' ) endDate: string = '',
  ): Promise<any> {
    try
    {
      const paginatedArchivedTickets = await this.ticketsService.findAllArchivedTickets(
        page,
        limit,
        status,
        provider,
        name,
        startDate,
        endDate,
      );
      return ResponseFormatter.success(
        200,
        'Archived Tickets Retrieved Successfully',
        paginatedArchivedTickets
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
