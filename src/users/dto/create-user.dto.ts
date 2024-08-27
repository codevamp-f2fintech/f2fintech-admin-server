import {
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import { Gender, Role } from '../entities/user.entity';
import { Status } from '../entities/user.entity';

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

  @IsEnum(Role)
  role: Role;
}
