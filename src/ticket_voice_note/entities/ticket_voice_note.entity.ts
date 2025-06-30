import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('ticket_voice_note')
export class TicketVoiceNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  ticket_id: number;

  @Column()
  @Index()
  user_id: number;

  @Column()
  voice_note_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
