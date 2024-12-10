import { Entity, Column, PrimaryGeneratedColumn, Index, BeforeInsert, OneToOne, JoinColumn } from 'typeorm';

import { Application } from 'src/applications/entities/applications.entity';

export enum Status {
  TO_DO = 'to do',
  IN_PROGRESS = 'in progress',
  ON_HOLD = 'on hold',
  DONE = 'done',
  CLOSE = 'close',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  // Define customer_application_id as a foreign key with an index for fast lookups
  @Column()
  @Index()
  customer_application_id: number;

  @OneToOne(() => Application, (application) => application.ticket)
  @JoinColumn({ name: 'customer_application_id' })  // Specify the foreign key column name
  application: Application;  // This will create the relationship with the Application entity

  @Column()
  @Index()
  user_id: number;

  @Column({ nullable: true })
  forwarded_to: number;

  @Column()
  original_estimate: string;

  @Column({
    type: 'enum',
    enum: Status
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
