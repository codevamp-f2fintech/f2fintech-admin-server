import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1')
@UseGuards(RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('create-ticket')
  @Roles(Role.Admin, Role.Sales)
  async create(@Body() createTicketDto: CreateTicketDto) {
    try {
      const newTicket = await this.ticketsService.create(createTicketDto);
      return ResponseFormatter.success(
        201,
        'Ticket created successfully',
        newTicket,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('get-all-tickets/:id')
  @Roles(Role.Admin, Role.Sales)
  async findAll() {
    try {
      const tickets = await this.ticketsService.findAll();
      return ResponseFormatter.success(
        200,
        'Tickets retrieved successfully',
        tickets,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('get-ticket/:ticketId')
  // @Roles(Role.Admin, Role.Sales)
  async findOne(@Param('ticketId') ticketId: string) {
    try {
      const ticket = await this.ticketsService.findOne(+ticketId);
      return ResponseFormatter.success(
        200,
        'Ticket retrieved successfully',
        ticket,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 404,
        error.message || 'Ticket not found',
      );
    }
  }

  @Patch('update-ticket/:ticketId')
  // @Roles(Role.Admin, Role.Sales)
  async update(
    @Param('ticketId') ticketId: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    try {
      const updatedTicket = await this.ticketsService.update(
        +ticketId,
        updateTicketDto,
      );
      return ResponseFormatter.success(200, 'Ticket updated successfully');
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
