import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('ticket_log')
export class TicketLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    ticket_id: number;

    @Column()
    @Index()
    user_id: number;

    @Column()
    time_spent: string;

    @Column()
    work_description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ name: 'company_id', nullable: true })
    company_id: number | null;
}
