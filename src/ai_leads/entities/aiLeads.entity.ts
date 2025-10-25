import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('ai_leads')
export class AiLeads {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 500 })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    loan_type: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    application_date: Date;
}
