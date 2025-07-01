import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketVoiceNoteDto {
  @IsNumber()
  @IsNotEmpty()
  ticket_id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  voice_note_url: string;

  @IsDate()
  @Type(() => Date)
  created_at: Date;
}
