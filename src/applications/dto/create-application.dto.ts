import { IsInt, IsDecimal, IsDateString, IsOptional, Min, Max } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateApplicationDto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  customer_id: number;

  @IsInt()
  application_no: number;

  @IsDecimal()
  amount: number;

  @IsInt()
  tenure: number;

  @IsDecimal()
  interest_rate: number;

  @IsDecimal()
  emi_amount: number;

  @IsInt()
  emi_count: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1)
  is_picked?: number;

  @IsDateString()
  application_date: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsDateString()
  last_updated: string;
}
