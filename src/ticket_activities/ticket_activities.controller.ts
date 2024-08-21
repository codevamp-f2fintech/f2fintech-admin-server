import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ActivitiesService } from './ticket_activities.service';
import { CreateTicketActivityDto } from './dto/create_ticket_activity.dto';

@Controller('ticket-activities')
export class TicketActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() createTicketActivityDto: CreateTicketActivityDto) {
    return this.activitiesService.create(createTicketActivityDto);
  }

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTicketActivityDto: CreateTicketActivityDto,
  ) {
    return this.activitiesService.update(+id, updateTicketActivityDto);
  }
}
