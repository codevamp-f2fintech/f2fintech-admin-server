import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

import { Ticket } from 'src/tickets/entities/ticket.entity';

@Entity('ticket-activities')
export class TicketActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticket_id: number;

  @Column()
  @Index()
  user_id: number;

  @Column({ length: 250 })
  comment: string;

  @Column({ nullable: true })
  attachment: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Ticket, (ticket) => ticket.activities)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;
}
