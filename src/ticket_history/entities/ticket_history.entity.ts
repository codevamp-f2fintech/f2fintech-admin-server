import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ticket_history')
export class TicketHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ticket_id: number;

    @Column()
    action: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
