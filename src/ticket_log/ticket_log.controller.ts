import { Controller, Get, Post, Body, Param, UseGuards, Headers } from '@nestjs/common';

import { TicketLogService } from './ticket_log.service';
import { CreateTicketLogDto } from './dto/create-ticket_log.dto';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller( 'api/v1/' )
@UseGuards( RolesGuard )
export class TicketLogController {
  constructor ( private readonly ticketLogService: TicketLogService ) { }

  @Post( 'create-ticket-log' )
  async create (
    @Body() createTicketLogDto: CreateTicketLogDto,
    @Headers( 'companyId' ) companyId: string,
  ) {
    try
    {
      const newLog = await this.ticketLogService.create(
        createTicketLogDto,
        companyId
      );
      return ResponseFormatter.success(
        200,
        'Ticket log created successfully',
        newLog,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get( 'get-ticket-logs/:ticketId' )
  async findAll (
    @Param( 'ticketId' ) ticketId: number,
    @Headers( 'companyId' ) companyId: string,
  ) {
    try
    {
      const logs = await this.ticketLogService.findAllByTicketId( ticketId, companyId );
      return ResponseFormatter.success(
        200,
        'Ticket logs retrieved successfully',
        logs,
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
