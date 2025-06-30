import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketVoiceNoteDto } from './create_ticket_voice_note.dto';

export class UpdateTicketVoiceNoteDto extends PartialType(
  CreateTicketVoiceNoteDto,
) { }
