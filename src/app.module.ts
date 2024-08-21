import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { TicketsController } from './tickets/tickets.controller';
import { TicketActivitiesController } from './ticket_activities/ticket_activities.controller';
import { UsersController } from './users/users.controller';

import { TicketActivity } from './ticket_activities/entities/ticket_activities.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { User } from './users/entities/user.entity';

import { TicketsModule } from './tickets/tickets.module';
import { TicketActivitiesModule } from './ticket_activities/ticket_activities.module';
import { UsersModule } from './users/users.module';

import { AppService } from './app.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'f2-fintech',
      entities: [User, Ticket, TicketActivity],
      synchronize: true,
    }),
    UsersModule,
    TicketsModule,
    TicketActivitiesModule,
    HealthModule,
  ],
  controllers: [
    AppController,
    UsersController,
    TicketActivitiesController,
    TicketsController,
  ],
  providers: [AppService],
})
export class AppModule {}
