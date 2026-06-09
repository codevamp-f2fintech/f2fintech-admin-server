import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

import { Gender, Role, Status } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Contact must be a valid 10-digit mobile number' })
  number: string;

  @IsString()
  @Length(2, 100)
  designation: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsEnum(Role)
  role: Role;
}
