import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ticket-activities')
export class TicketActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  ticketId: string;

  @Column({ length: 250 })
  comment: string;

  @Column()
  attachment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
