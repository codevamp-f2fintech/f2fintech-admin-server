import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ActivitiesService } from './ticket_activities.service';
import { CreateTicketActivityDto } from './dto/create_ticket_activity.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1/')
@UseGuards(RolesGuard)
export class TicketActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('create-ticket-activity')
  //@Roles(Role.Admin, Role.Sales) 
  async create(@Body() createTicketActivityDto: CreateTicketActivityDto) {
    try {
      const newActivity = await this.activitiesService.create(createTicketActivityDto);
      return ResponseFormatter.success(
        201,
        'Ticket activity created successfully',
        newActivity,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('get-all-ticket-activities/:ticketId')
  // @Roles(Role.Admin, Role.Sales) // Uncomment if you want to enforce roles
  async findAll(@Param('ticketId') ticketId: number) { 
    try {
      const activities = await this.activitiesService.findAllByTicketId(ticketId); 
      return ResponseFormatter.success(
        200,
        'Ticket activities retrieved successfully',
         activities,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Patch('update-ticket-activity/:ticket_id/:id')
  async update(
    @Param('ticket_id') ticket_id: string,  // Get ticket_id from route
    @Param('id') id: string,  // Get id from route
    @Body() updateTicketActivityDto: CreateTicketActivityDto,
  ) {
    try {
      const updatedActivity = await this.activitiesService.updateByTicketIdAndId(
        ticket_id,
        id,
        updateTicketActivityDto,
      );
      return ResponseFormatter.success(
        200,
        'Ticket activity updated successfully',
        updatedActivity,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Delete('delete-ticket-activity/:ticket_id')
  async remove(@Param('ticket_id') ticket_id: string) {
    try {
      await this.activitiesService.remove(ticket_id);
      return ResponseFormatter.success(200, 'Ticket activity deleted successfully');
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
