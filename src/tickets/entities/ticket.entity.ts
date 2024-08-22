import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  customerApplication: string;

  @Column({ length: 11 })
  userId: string;

  @Column({ length: 20 })
  forwardedTo: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({ type: 'date', unique: true })
  dueDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
