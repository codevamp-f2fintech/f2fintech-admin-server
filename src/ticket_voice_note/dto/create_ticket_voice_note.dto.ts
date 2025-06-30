import { IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketVoiceNoteDto {
  @IsNumber()
  ticket_id: number;

  @IsNumber()
  user_id: number;

  @IsString()
  voice_note_url: string;

  @IsDate()
  @Type(() => Date)
  created_at: Date;
}
