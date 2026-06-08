import { Company } from 'src/companies/entities/company.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

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
  SUBADMIN = 'sub admin',
  SALES = 'sales',
  OPERATIONS = 'operations',
  CREDIT = 'credit',
  SUPERADMIN = 'super admin',
}

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 15 })
  number: string;

  @Column()
  designation: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.SALES,
  })
  role: Role;

  // @ManyToOne(() => Company, company => company.users)
  // @JoinColumn({
  //   name: 'company_id',
  //   referencedColumnName: 'companyId',
  // })
  // company: Company;

  // @Column({ name: 'company_id' })
  // companyId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updated_at = new Date();
  }
}
