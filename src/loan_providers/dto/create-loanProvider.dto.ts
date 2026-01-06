import {
  IsDate,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateLoanProviderDto {
  @IsNumber()
  id: number;

  @IsNumber()
  max_tenure: number;

  @IsNumber()
  min_amount: number;

  @IsNumber()
  max_amount: number;

  @IsBoolean()
  is_home: boolean;

  @IsString()
  @IsOptional()  // Nullable in entity
  home_image: string;

  @IsString()
  country: string;

  @IsString()
  title: string;

  @IsString()
  interest_rate: string;

  @IsString()
  @IsOptional()  // Nullable in entity
  description: string;

  @IsString()
  @IsOptional()  // Nullable in entity
  short_description: string;

  @IsString()
  @IsOptional()  // Nullable in entity
  long_description: string;

  @IsString()
  @IsOptional()  // Nullable in entity
  charges: string;

  @IsString()
  @IsOptional()  // Nullable in entity
  minimum_kyc: string;

  @IsString()
  @IsOptional()  // Nullable in entity
  document_required: string;

  @IsDate()
  created_at: Date;

  // @IsNumber()
  // @IsOptional()
  // company_id: number;
}
