import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { TicketHistoryService } from './ticket_history.service';
import { CreateTicketHistoryDto } from './dto/create-ticket_history.dto';
import { UpdateTicketHistoryDto } from './dto/update-ticket_history.dto';

import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1/')
@UseGuards(RolesGuard)
export class TicketHistoryController {
  constructor(private readonly ticketHistoryService: TicketHistoryService) { }

  @Post('create-ticket-history')
  @Roles(Role.Admin, Role.Sales)
  async create(@Body() createTicketHistoryDto: CreateTicketHistoryDto) {
    try {
      const newHistory = await this.ticketHistoryService.create(
        createTicketHistoryDto,
      );
      return ResponseFormatter.success(
        200,
        'Ticket history created successfully',
        newHistory,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('get-ticket-histories/:ticketId')
  @Roles(Role.Admin, Role.Sales)
  async findAll(@Param('ticketId') ticketId: number) {
    try {
      const histories = await this.ticketHistoryService.findAllByTicketId(ticketId);
      return ResponseFormatter.success(
        200,
        'Ticket histories retrieved successfully',
        histories,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  // @Patch('update-ticket-history/:id')
  // @Roles(Role.Admin, Role.Sales)
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateTicketHistoryDto: UpdateTicketHistoryDto,
  // ) {
  //   try {
  //     const updatedHistory = await this.ticketHistoryService.update(
  //       +id,
  //       updateTicketHistoryDto,
  //     );
  //     return ResponseFormatter.success(
  //       200,
  //       'Ticket history updated successfully',
  //       updatedHistory,
  //     );
  //   } catch (error) {
  //     return ResponseFormatter.error(
  //       error.status || 500,
  //       error.message || 'Internal server error',
  //     );
  //   }
  // }
}
