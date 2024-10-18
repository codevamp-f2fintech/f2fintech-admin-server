import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ticket-activities')
export class TicketActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  ticket_id: string;

  @Column({ length: 250 })
  comment: string;

  @Column()
  attachment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
