import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  BeforeInsert,
  OneToOne,
  JoinColumn
} from 'typeorm';

import { Application } from 'src/applications/entities/applications.entity';

export enum Status {
  UNDER_CREDIT_REVIEW = 'under credit review',
  OPERATIONS = 'operations',
  PENDENCY_IN_FILE = 'pendency in file',
  FILE_SEND_TO_BANKER = 'file send to banker',
  TO_BE_APPROVED = 'to be approved',
  TO_BE_DISBURSED = 'to be disbursed',
  APPROVED = 'approved',
  DISBURSED = 'disbursed',
  CARRY_FORWARD = 'carry forward',
  REJECTED = 'rejected',
  DROP = 'drop',
  // TO_BE_LOGIN = 'to be login',
  // TVR_DONE = 'tvr done',
  // CAM_REPORT_DONE = 'cam report done',
  // RELOOK = 'relook'
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
  @JoinColumn({ name: 'customer_application_id' }) // Specify the foreign key column name
  application: Application; // This will create the relationship with the Application entity

  @Column()
  @Index()
  user_id: number;

  @Column({ nullable: true })
  forwarded_to: number;

  @Column({ nullable: true })
  forwarded_by: number;

  @Column({
    type: 'tinyint',
    width: 1,          // Width 1 because it’s used as a boolean-like field
    default: 0,
  })
  is_forwarded: number;

  @Column()
  original_estimate: string;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;

  @Column()
  voice_note_url: string;

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
