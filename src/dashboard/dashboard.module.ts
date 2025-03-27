import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Application } from 'src/applications/entities/applications.entity';
import { User } from 'src/users/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity'; // Import the Ticket entity

@Module({
  imports: [TypeOrmModule.forFeature([Application, User, Ticket])], // Register both entities
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule { }
