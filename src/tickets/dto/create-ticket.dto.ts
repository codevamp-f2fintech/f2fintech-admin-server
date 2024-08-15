import { IsString, IsEnum, IsDate, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { Status } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsString()
  @Length(1, 20)
  customerApplication: string;

  @IsString()
  @Length(1, 11)
  userId: string;

  @IsString()
  @Length(1, 20)
  forwardedTo: string;

  @IsEnum(Status)
  status: Status;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
