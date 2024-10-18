import { IsInt, IsDecimal, IsDateString } from 'class-validator';

export class CreateApplicationDto {
  @IsInt()
  customer_id: number;

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

  @IsDateString()
  application_date: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsDateString()
  last_updated: string;
}
