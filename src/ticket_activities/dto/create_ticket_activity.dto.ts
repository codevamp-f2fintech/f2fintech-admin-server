import { IsString, IsOptional, Length } from 'class-validator';

export class CreateTicketActivityDto {
  @IsString()
  @Length(1, 20)
  ticket_id: string;

  @IsString()
  comment: string;

  @IsString()
  @IsOptional()
  @Length(0, 20)
  attachment?: string;
}
