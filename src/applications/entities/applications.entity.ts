import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

import { Ticket } from 'src/tickets/entities/ticket.entity';

@Entity('customer_application')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'int' })
  application_no: number;

  @OneToOne(() => Ticket, (ticket) => ticket.application)  // One-to-one relationship
  ticket: Ticket;  // This will hold the related ticket for this application

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'int' })
  tenure: number;

  @Column({ type: 'decimal' })
  interest_rate: number;

  @Column({ type: 'decimal' })
  emi_amount: number;

  @Column({ type: 'int' })
  emi_count: number;

  @Column({
    type: 'tinyint',
    width: 1,          // Width 1 because it’s used as a boolean-like field
    default: 0,
  })
  is_picked: number;

  @Column({ type: 'date' })
  application_date: Date;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'timestamp' })
  last_updated: Date;
}
