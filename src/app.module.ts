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
import { TicketArchive } from './tickets/entities/ticketArchive.entity';
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
import { AiLeads } from './ai_leads/entities/aiLeads.entity';
import { AiLeadsModule } from './ai_leads/ai_leads.module';
import { CompaniesModule } from './companies/companies.module';
import { Company } from './companies/entities/company.entity';
import { LeadsModule } from './leads/leads.module';
import { LeadInfo } from './leads/entities/leadInfo.entity';
import { QueriesModule } from './queries/queries.module';
import { SendQuery } from './queries/entities/sendQuery.entity';
import { Notification } from './notifications/entities/notification.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { TeamsModule } from './teams/teams.module';
import { Team } from './teams/entities/team.entity';

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
        timezone: '+05:30', // Ensure TypeORM handles dates in IST instead of UTC
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
        entities: [
          AiLeads,
          Application,
          Customer,
          CustomerDocument,
          CustomerInfo,
          LoanProvider,
          LoanTracking,
          Team,
          Ticket,
          TicketArchive,
          TicketActivity,
          TicketLog,
          TicketHistory,
          TicketVoiceNote,
          User,
          Company,
          LeadInfo,
          SendQuery,
          Notification],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AiLeadsModule,
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
    CompaniesModule,
    LeadsModule,
    QueriesModule,
    NotificationsModule,
    TeamsModule,
  ],
  providers: [AppService],
})

export class AppModule { }
