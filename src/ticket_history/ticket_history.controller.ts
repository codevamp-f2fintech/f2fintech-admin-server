import { Controller, Get, Post, Body, Param, UseGuards, Headers } from '@nestjs/common';

import { TicketHistoryService } from './ticket_history.service';
import { CreateTicketHistoryDto } from './dto/create-ticket_history.dto';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller( 'api/v1/' )
@UseGuards( RolesGuard )
export class TicketHistoryController {
  constructor ( private readonly ticketHistoryService: TicketHistoryService ) { }

  @Post( 'create-ticket-history' )
  async create (
    @Body() createTicketHistoryDto: CreateTicketHistoryDto,
    @Headers( 'Companyid' ) companyIdString?: string
  ) {
    try
    {
      const companyId = companyIdString && !isNaN( Number( companyIdString ) )
        ? Number( companyIdString )
        : null;
      const newHistory = await this.ticketHistoryService.create(
        createTicketHistoryDto,
        companyId
      );
      return ResponseFormatter.success(
        200,
        'Ticket history created successfully',
        newHistory,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get( 'get-ticket-histories/:ticketId' )
  async findAll (
    @Param( 'ticketId' ) ticketId: number,
    @Headers( 'Companyid' ) companyIdString?: string
  ) {
    try
    {
      const companyId = companyIdString && !isNaN( Number( companyIdString ) )
        ? Number( companyIdString )
        : null;
      const histories = await this.ticketHistoryService.findAllByTicketId( ticketId, companyId );
      return ResponseFormatter.success(
        200,
        'Ticket histories retrieved successfully',
        histories,
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
