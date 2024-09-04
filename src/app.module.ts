import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        entities: [User, Ticket, TicketActivity],
        synchronize: false,
      }),
      inject: [ConfigService],
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
