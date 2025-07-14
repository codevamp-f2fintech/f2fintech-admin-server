import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
    OneToOne,
    JoinColumn,
} from 'typeorm';

import { Application } from 'src/applications/entities/applications.entity';

export enum Status {
    UNDER_CREDIT_REVIEW = 'under credit review',
    OPERATIONS = 'operations',
    PENDENCY_IN_FILE = 'pendency in file',
    FILE_SEND_TO_BANKER = 'file send to banker',
    TO_BE_APPROVED = 'to be approved',
    TO_BE_DISBURSED = 'to be disbursed',
    APPROVED = 'approved',
    DISBURSED = 'disbursed',
    CARRY_FORWARD = 'carry forward',
    REJECTED = 'rejected',
    DROP = 'drop',
    HOLD = 'hold',
}

@Entity('ticket_archive')
export class TicketArchive {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    customer_application_id: number;

    @OneToOne(() => Application, (application) => application.ticket)
    @JoinColumn({ name: 'customer_application_id' })
    application: Application;

    @Column()
    @Index()
    user_id: number;

    @Column()
    original_ticket_id: number;

    @Column({ nullable: true })
    forwarded_to: number;

    @Column({ nullable: true })
    forwarded_by: number;

    @Column({
        type: 'tinyint',
        width: 1,
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

    @Column({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'timestamp' })
    updated_at: Date;

    @Column({ type: 'text', nullable: true })
    reason_to_delete: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    archived_at: Date;

    @Column()
    @Index()
    archived_by: number;
}