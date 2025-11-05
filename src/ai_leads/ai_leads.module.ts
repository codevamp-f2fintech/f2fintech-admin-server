import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiLeads } from './entities/aiLeads.entity';
import { AiLeadsService } from './ai_leads.service';
import { AiLeadsController } from './ai_leads.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AiLeads])],
  controllers: [AiLeadsController],
  providers: [AiLeadsService],
})

export class AiLeadsModule { }
