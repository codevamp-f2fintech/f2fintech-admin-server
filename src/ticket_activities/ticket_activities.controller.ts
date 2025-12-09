import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';

import { ActivitiesService } from './ticket_activities.service';
import { CreateTicketActivityDto } from './dto/create_ticket_activity.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller( 'api/v1/' )
@UseGuards( RolesGuard )
export class TicketActivitiesController {
  constructor ( private readonly activitiesService: ActivitiesService ) { }

  @Post( 'create-ticket-activity' )
  async create (
    @Body() createTicketActivityDto: CreateTicketActivityDto,
    @Headers( 'Companyid' ) companyIdString?: string
  ) {
    try
    {
      const companyId = companyIdString && !isNaN( Number( companyIdString ) )
        ? Number( companyIdString )
        : null;
      const newActivity = await this.activitiesService.create( createTicketActivityDto, companyId );
      return ResponseFormatter.success(
        201,
        'Ticket activity created successfully',
        newActivity,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get( 'get-ticket-activities/:ticketId' )
  async findAll (
    @Param( 'ticketId' ) ticketId: number,
    @Headers( 'Companyid' ) companyIdString?: string
  ) {
    try
    {
      const companyId = companyIdString && !isNaN( Number( companyIdString ) )
        ? Number( companyIdString )
        : null;
      const activities = await this.activitiesService.findAllByTicketId( ticketId, companyId );
      return ResponseFormatter.success(
        200,
        'Ticket activities retrieved successfully',
        activities,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Patch( 'update-ticket-activity/:ticket_id/:id' )
  async update (
    @Param( 'ticket_id' ) ticket_id: number,  // Get ticket_id from route
    @Param( 'id' ) id: number,  // Get id from route
    @Body() updateTicketActivityDto: CreateTicketActivityDto,
    @Headers( 'Companyid' ) companyIdString?: string
  ) {
    try
    {
      const companyId = companyIdString && !isNaN( Number( companyIdString ) )
        ? Number( companyIdString )
        : null;
      const updatedActivity = await this.activitiesService.updateByTicketIdAndId(
        ticket_id,
        id,
        updateTicketActivityDto,
        companyId
      );
      return ResponseFormatter.success(
        200,
        'Ticket activity updated successfully',
        updatedActivity,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Delete( 'delete-ticket-activity/:id' )
  async remove (
    @Param( 'id' ) id: number,
    @Headers( 'Companyid' ) companyIdString?: string
  ) {
    try
    {
      const companyId = companyIdString && !isNaN( Number( companyIdString ) )
        ? Number( companyIdString )
        : null;
      await this.activitiesService.remove( id, companyId );
      return ResponseFormatter.success( 200, 'Ticket activity deleted successfully' );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
