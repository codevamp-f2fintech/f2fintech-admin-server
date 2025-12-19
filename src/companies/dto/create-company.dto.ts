// src/companies/dto/create-company.dto.ts
import { IsString, IsBoolean, IsOptional, Length, IsEmail, IsUrl, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    @Length(1, 255)
    name: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @Length(1, 20)
    contactNumber?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsUrl()
    @IsOptional()
    website?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsNumber()
    @IsNotEmpty()
    companyId: number;
}