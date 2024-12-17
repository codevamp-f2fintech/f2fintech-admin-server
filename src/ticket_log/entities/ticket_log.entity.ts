import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

import { Ticket } from 'src/tickets/entities/ticket.entity';

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

    @ManyToOne(() => Ticket, (ticket) => ticket.logs)
    @JoinColumn({ name: 'ticket_id' })
    ticket: Ticket;
}
