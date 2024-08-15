import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TicketActivitiesModule } from './ticket_activities/ticket_activities.module';
import { TicketsModule } from './tickets/tickets.module';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { TicketsController } from './tickets/tickets.controller';
import { User } from './users/entities/user.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { Activity } from './ticket_activities/entities/ticket_activity.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'f2-fintech',
      entities: [User, Ticket, Activity],
      synchronize: true,
    }),
    UsersModule,
    TicketsModule,
    TicketActivitiesModule,
  ],
  controllers: [AppController, UsersController, TicketsController],
  providers: [AppService],
})
export class AppModule {}
