import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  // Define customer_application_id as a foreign key with an index for fast lookups
  @Column()
  @Index()
  customer_application_id: number;

  @Column()
  @Index()
  user_id: number;

  @Column()
  forwarded_to: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({ type: 'date', unique: true })
  due_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
