import { IsEnum, IsDate, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsNumber()
  customer_application_id: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  forwarded_to: number;

  @IsString()
  original_estimate: string;

  @IsEnum(Status)
  status: Status;

  @IsDate()
  @Type(() => Date)
  due_date: Date;

  @IsDate()
  @Type(() => Date)
  created_at: Date;

  @IsDate()
  @Type(() => Date)
  updated_at: Date;
}
