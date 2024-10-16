import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivitiesService } from './ticket_activities.service';
import { TicketActivitiesController } from './ticket_activities.controller';
import { TicketActivity } from './entities/ticket_activities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketActivity])],
  controllers: [TicketActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class TicketActivitiesModule { }
