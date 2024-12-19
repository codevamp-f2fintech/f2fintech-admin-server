import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { Customer } from './customer.entity';

@Entity('customer_document')
export class CustomerDocument {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    customer_id: number;

    @Column({ type: 'text' })
    document_url: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({
        type: 'enum',
        enum: ['aadhaar front', 'aadhaar back', 'pancard', 'bank statement', 'form 16', 'payslips', 'profile', 'photo', 'certificate', 'audio'],
    })
    type: 'aadhaar front' | 'aadhaar back' | 'pancard' | 'bank statement' | 'form 16' | 'payslips' | 'profile' | 'photo' | 'certificate' | 'audio';

    @ManyToOne(() => Customer, (customer) => customer.customerDocuments, { eager: false })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;
}
