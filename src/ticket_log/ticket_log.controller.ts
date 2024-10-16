import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { TicketLogService } from './ticket_log.service';
import { CreateTicketLogDto } from './dto/create-ticket_log.dto';
import { UpdateTicketLogDto } from './dto/update-ticket_log.dto';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1')
@UseGuards(RolesGuard)
export class TicketLogController {
  constructor(private readonly ticketLogService: TicketLogService) { }

  @Post('create-ticket-log')
  @Roles(Role.Admin, Role.Sales)
  async create(@Body() createTicketLogDto: CreateTicketLogDto) {
    try {
      const newLog = await this.ticketLogService.create(
        createTicketLogDto,
      );
      return ResponseFormatter.success(
        200,
        'Ticket log created successfully',
        newLog,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('get-ticket-logs/:ticketId')
  @Roles(Role.Admin, Role.Sales)
  async findAll(@Param('ticketId') ticketId: number) {
    try {
      const logs = await this.ticketLogService.findAllByTicketId(ticketId);
      return ResponseFormatter.success(
        200,
        'Ticket logs retrieved successfully',
        logs,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
