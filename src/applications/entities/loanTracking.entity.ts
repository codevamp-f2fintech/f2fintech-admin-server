import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Application } from './applications.entity';

@Entity('loan_tracking')
export class LoanTracking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    customer_application_id: number;

    @Column({
        type: 'enum',
        enum: ['submitted', 'under credit review', 'login', 'carry forward', 'drop', 'relook', 'approved', 'rejected', 'disbursed', 'hold'],
        default: 'submitted',
    })
    status: 'submitted' | 'under credit review' | 'login' | 'carry forward' | 'drop' | 'relook' | 'approved' | 'rejected' | 'disbursed' | 'hold';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToOne(() => Application, (application) => application.loanTracking, {
        eager: false,
    })
    @JoinColumn({ name: 'customer_application_id' })
    application: Application;
}
