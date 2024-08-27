import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './ticket_activities.service';
import { CreateTicketActivityDto } from './dto/create_ticket_activity.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/ticket-activity')
@UseGuards(RolesGuard)
export class TicketActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @Roles(Role.Admin, Role.Sales)
  async create(@Body() createTicketActivityDto: CreateTicketActivityDto) {
    try {
      const newActivity = await this.activitiesService.create(
        createTicketActivityDto,
      );
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

  @Get()
  @Roles(Role.Admin, Role.Sales)
  async findAll() {
    try {
      const activities = await this.activitiesService.findAll();
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

  @Get(':id')
  @Roles(Role.Admin, Role.Sales)
  async findOne(@Param('id') id: string) {
    try {
      const activity = await this.activitiesService.findOne(+id);
      return ResponseFormatter.success(
        200,
        'Ticket activity retrieved successfully',
        activity,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 404,
        error.message || 'Ticket activity not found',
      );
    }
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.Sales)
  async update(
    @Param('id') id: string,
    @Body() updateTicketActivityDto: CreateTicketActivityDto,
  ) {
    try {
      const updatedActivity = await this.activitiesService.update(
        +id,
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
}
