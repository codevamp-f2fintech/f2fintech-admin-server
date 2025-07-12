import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsOptional, IsString, IsInt, IsDecimal, IsDateString } from 'class-validator';

export class UpdateApplicationDto extends PartialType( CreateApplicationDto ) {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerContact?: string;

  @IsOptional()
  @IsString()
  customerDesignation?: string;

  @IsOptional()
  @IsString()
  customerLocation?: string;

  @IsOptional()
  @IsString()
  customerState?: string;

  @IsOptional()
  @IsDecimal()
  applicationAmount?: number;

  @IsOptional()
  @IsInt()
  applicationTenure?: number;

  @IsOptional()
  @IsDateString()
  applicationDate?: string;

  @IsOptional()
  @IsString()
  provider?: string;
  // applicationProvider: any; 
  @IsOptional()
  @IsString()
  customerProvider?: string;

  // Add any other fields that are needed for updating application
}
