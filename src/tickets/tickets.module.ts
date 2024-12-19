import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ticket } from './entities/ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Ticket])
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})

export class TicketsModule { }
