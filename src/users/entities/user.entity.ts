import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum Role {
  ADMIN = 'admin',
  SALES = 'sales',
}

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 15 }) // Use 'bigint' for large numbers
  number: string;

  @Column()
  designation: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER, // Optional: Set a default value
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE, // Optional: Set a default value
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.SALES,
  })
  role: Role;
}
