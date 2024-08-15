import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateTicketActivityDto {
  @IsString()
  @IsOptional()
  @Length(1, 20)
  ticketId?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  @Length(0, 20)
  attachment?: string;
}
