import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketLog } from './entities/ticket_log.entity';
import { TicketLogService } from './ticket_log.service';
import { TicketLogController } from './ticket_log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TicketLog])],
  controllers: [TicketLogController],
  providers: [TicketLogService],
})
export class TicketLogModule { }
