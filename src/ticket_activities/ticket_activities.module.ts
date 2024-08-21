import { Module } from '@nestjs/common';
import { ActivitiesService } from './ticket_activities.service';
import { TicketActivitiesController } from './ticket_activities.controller';
import { TicketActivity } from './entities/ticket_activities.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TicketActivity])],
  controllers: [TicketActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class TicketActivitiesModule {}
