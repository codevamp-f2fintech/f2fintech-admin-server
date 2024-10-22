import { Entity, Column, PrimaryGeneratedColumn, Index, BeforeInsert } from 'typeorm';

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

  @Column({ nullable: true })
  forwarded_to: number;

  @Column()
  original_estimate: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  setDefaultDueDate() {
    if (!this.due_date) {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      this.due_date = today;
    }
  }
}
