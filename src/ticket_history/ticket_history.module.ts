import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketHistory } from './entities/ticket_history.entity';
import { TicketHistoryService } from './ticket_history.service';
import { TicketHistoryController } from './ticket_history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TicketHistory])],
  controllers: [TicketHistoryController],
  providers: [TicketHistoryService],
})
export class TicketHistoryModule { }
