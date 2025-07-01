import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Application } from './applications/entities/applications.entity';
import { Customer } from './applications/entities/customer.entity';
import { CustomerDocument } from './applications/entities/customerDocuments.entity';
import { CustomerInfo } from './applications/entities/customerInfo.entity';
import { LoanProvider } from './loan_providers/entities/loanProvider.entity';
import { LoanTracking } from './applications/entities/loanTracking.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { TicketActivity } from './ticket_activities/entities/ticket_activities.entity';
import { TicketLog } from './ticket_log/entities/ticket_log.entity';
import { TicketVoiceNote } from './ticket_voice_note/entities/ticket_voice_note.entity';
import { TicketHistory } from './ticket_history/entities/ticket_history.entity';
import { User } from './users/entities/user.entity';

import { ApplicationsModule } from './applications/applications.module';
import { LoanProvidersModule } from './loan_providers/loanProvider.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketActivitiesModule } from './ticket_activities/ticket_activities.module';
import { TicketLogModule } from './ticket_log/ticket_log.module';
import { TicketHistoryModule } from './ticket_history/ticket_history.module';
import { TicketVoiceNoteModule } from './ticket_voice_note/ticket_voice_note.module';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';

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
          Customer,
          CustomerDocument,
          CustomerInfo,
          LoanProvider,
          LoanTracking,
          Ticket,
          TicketActivity,
          TicketLog,
          TicketHistory,
          TicketVoiceNote,
          User,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ApplicationsModule,
    DashboardModule,
    HealthModule,
    LoanProvidersModule,
    TicketsModule,
    TicketActivitiesModule,
    TicketLogModule,
    TicketHistoryModule,
    TicketVoiceNoteModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule { }
