import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ticket_log')
export class TicketLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ticket_id: number;

    @Column()
    time_spent: string;

    @Column()
    work_description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
