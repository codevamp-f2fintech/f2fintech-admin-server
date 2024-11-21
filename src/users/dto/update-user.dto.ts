import { Gender, Role, Status } from "../entities/user.entity";

export class UpdateUserDto {
    id: number;
    username?: string;
    email?: string;
    contact?: number;
    designation?: string;
    gender?: Gender;
    status?: Status;
    role?: Role;
    password?: string;
  }
  
