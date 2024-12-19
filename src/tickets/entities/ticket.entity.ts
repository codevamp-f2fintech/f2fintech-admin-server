import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Application } from 'src/applications/entities/applications.entity';
import { TicketActivity } from 'src/ticket_activities/entities/ticket_activities.entity';
import { TicketLog } from 'src/ticket_log/entities/ticket_log.entity';

export enum Status {
  UNDER_CREDIT_REVIEW = 'under credit review',
  TO_BE_LOGIN = 'to be login',
  PENDENCY_IN_FILE = 'pendency in file',
  TO_BE_APPROVED = 'to be approved',
  TO_BE_DISBURSED = 'to be disbursed',
  FILE_SEND_TO_BANKER = 'file send to banker',
  TVR_DONE = 'tvr done',
  CAM_REPORT_DONE = 'cam report done',
  RELOOK = 'relook'
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

  @OneToMany(() => TicketActivity, (activity) => activity.ticket)
  activities: TicketActivity[];

  // One-to-Many relation with TicketLog
  @OneToMany(() => TicketLog, (log) => log.ticket)
  logs: TicketLog[];

  @BeforeInsert()
  setDefaultDueDate() {
    if (!this.due_date) {
      const today = new Date();
      today.setDate(today.getDate() + 1);
      this.due_date = today;
    }
  }
}
