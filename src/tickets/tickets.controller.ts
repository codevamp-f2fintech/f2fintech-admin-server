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

@Controller('api/ticket')
@UseGuards(RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('create')
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

  @Get()
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

  @Get(':id')
  @Roles(Role.Admin, Role.Sales)
  async findOne(@Param('id') id: string) {
    try {
      const ticket = await this.ticketsService.findOne(+id);
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

  @Patch(':id')
  @Roles(Role.Admin, Role.Sales)
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    try {
      const updatedTicket = await this.ticketsService.update(
        +id,
        updateTicketDto,
      );
      return ResponseFormatter.success(
        200,
        'Ticket updated successfully',
        updatedTicket,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
