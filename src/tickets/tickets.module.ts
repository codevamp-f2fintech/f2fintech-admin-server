import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticket } from './entities/ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TicketHistory } from 'src/ticket_history/entities/ticket_history.entity';
import { TicketLog } from 'src/ticket_log/entities/ticket_log.entity';
import { TicketActivity } from 'src/ticket_activities/entities/ticket_activities.entity';
import { LoanTracking } from 'src/applications/entities/loanTracking.entity';
import { Application } from 'src/applications/entities/applications.entity';
import { TicketArchive } from './entities/ticketArchive.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module( {
  imports: [
    HttpModule,
    TypeOrmModule.forFeature( [ Ticket, TicketArchive, TicketHistory, TicketLog, TicketActivity, LoanTracking, Application ] ),
    NotificationsModule
  ],
  controllers: [ TicketsController ],
  providers: [ TicketsService ],
  exports: [ TicketsService ],
} )

export class TicketsModule { }
