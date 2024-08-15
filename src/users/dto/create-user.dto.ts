import {
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';

// Define enums directly in this file
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateUserDto {
  @IsString()
  @Length(1, 100)
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsNumber()
  contact: string;

  @IsString()
  designation: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(Status)
  @IsOptional() // status is optional, so it can be omitted
  status?: Status;
}
