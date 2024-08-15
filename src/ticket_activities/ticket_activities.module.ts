import { Module } from '@nestjs/common';
import { ActivitiesService } from './ticket_activities.service';
import { TicketActivitiesController } from './ticket_activities.controller';
import { Activity } from './entities/ticket_activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [TicketActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class TicketActivitiesModule {}
