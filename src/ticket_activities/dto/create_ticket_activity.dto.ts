import { IsString, IsOptional, Length } from 'class-validator';

export class CreateTicketActivityDto {
  @IsString()
  @Length(1, 20)
  ticketId: string;

  @IsString()
  comment: string;

  @IsString()
  @IsOptional()
  @Length(0, 20)
  attachment?: string;
}
