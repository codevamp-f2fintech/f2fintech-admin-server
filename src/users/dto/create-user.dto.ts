import {
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Gender, Role } from '../entities/user.entity';
import { Status } from '../entities/user.entity';

export class CreateUserDto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(50)
  username: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsNumber()
  contact: number;

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
