import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { TicketsController } from './tickets/tickets.controller';
import { TicketActivitiesController } from './ticket_activities/ticket_activities.controller';
import { UsersController } from './users/users.controller';

import { Application } from './applications/entities/applications.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { TicketActivity } from './ticket_activities/entities/ticket_activities.entity';
import { TicketLog } from './ticket_log/entities/ticket_log.entity';
import { TicketHistory } from './ticket_history/entities/ticket_history.entity';
import { User } from './users/entities/user.entity';

import { ApplicationsModule } from './applications/applications.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketActivitiesModule } from './ticket_activities/ticket_activities.module';
import { TicketLogModule } from './ticket_log/ticket_log.module';
import { TicketHistoryModule } from './ticket_history/ticket_history.module';
import { UsersModule } from './users/users.module';

import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { ApplicationsController } from './applications/applications.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql'>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
        entities: [
          Application,
          User,
          Ticket,
          TicketActivity,
          TicketLog,
          TicketHistory,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ApplicationsModule,
    HealthModule,
    TicketsModule,
    TicketActivitiesModule,
    TicketLogModule,
    TicketHistoryModule,
    UsersModule,
    DashboardModule,
  ],
  controllers: [
    AppController,
    UsersController,
    TicketActivitiesController,
    TicketsController,
    DashboardController,
    ApplicationsController,
  ],
  providers: [AppService],
})
export class AppModule {}
