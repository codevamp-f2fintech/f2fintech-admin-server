import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTicketActivityDto {
  @IsString()
  ticket_id: number;

  @IsNumber()
  user_id: number;

  @IsString()
  comment: string;

  @IsString()
  @IsOptional()
  attachment?: string;
}
