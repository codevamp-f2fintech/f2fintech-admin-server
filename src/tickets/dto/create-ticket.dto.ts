import { IsEnum, IsDate, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { Status } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsNumber()
  customer_application_id: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  forwarded_to: number;

  @IsNumber()
  forwarded_by: number;

  @IsNumber()
  is_forwarded: number;

  @IsString()
  original_estimate: string;

  @IsString()
  voice_note_url: string;

  @IsEnum( Status )
  status: Status;

  @IsDate()
  @Type( () => Date )
  due_date: Date;

  @IsDate()
  @Type( () => Date )
  created_at: Date;

  @IsDate()
  @Type( () => Date )
  updated_at: Date;

  @IsDate()
  @Type( () => Date )
  disbursed_at: Date;

  @IsNumber()
  disbursed_amount: number;

  @IsDate()
  @Type( () => Date )
  approved_at: Date;

  @IsNumber()
  approved_amount: number;

  @IsNumber()
  cashback_amount: number;

  @IsNumber()
  @IsOptional()
  @IsNumber()
  companyId?: number;
}
