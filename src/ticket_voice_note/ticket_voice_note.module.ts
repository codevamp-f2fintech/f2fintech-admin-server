import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketVoiceNoteService } from './ticket_voice_note.service';
import { TicketVoiceNoteController } from './ticket_voice_note.controller';
import { TicketVoiceNote } from './entities/ticket_voice_note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketVoiceNote])],
  controllers: [TicketVoiceNoteController],
  providers: [TicketVoiceNoteService],
  exports: [TicketVoiceNoteService],
})

export class TicketVoiceNoteModule { }
