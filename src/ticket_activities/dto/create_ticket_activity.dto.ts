import { IsString, IsOptional } from 'class-validator';

export class CreateTicketActivityDto {
  @IsString()
  ticket_id: string;

  @IsString()
  comment: string;

  @IsString()
  @IsOptional()
  attachment?: string;
}
