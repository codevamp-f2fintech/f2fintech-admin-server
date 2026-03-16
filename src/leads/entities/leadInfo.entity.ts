import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity('leads_info')
export class LeadInfo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    pan: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    dob: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    loan_category: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    age: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    income: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    amount: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    loan_history: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    company_registration_type: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    gst_number: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    udhyam_number: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    itr: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    turnover: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    profit: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    incorporation_date: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    property_type: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    ownership_type: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    property_location: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    estimated_value: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    employment_type: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    doctor_type: string;

    @Column({ type: 'text', nullable: true })
    degree: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    license_number: string;

    @Column({ type: 'int', nullable: true })
    existing_emi: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    requested_emi: string;

    @Column({ type: 'text', nullable: true })
    cibil: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    provider: string;

    @Column({ type: 'text', nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    persona: string;

    @Column({ type: 'int', nullable: true })
    experience_years: number;

    @Column({ type: 'int', nullable: true })
    declared_income: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    product: string;

    @Column({ type: 'int', nullable: true })
    requested_limit: number;

    @Column({ type: 'int', nullable: true })
    tenure_months: number;

    @Column({ type: 'varchar', length: 10, nullable: true })
    pincode: string;

    @Column({ type: 'tinyint', width: 1, default: 0 })
    foreign_degree: number;

    @Column({ type: 'tinyint', width: 1, default: 0 })
    college_on_list: number;

    @Column({ type: 'varchar', length: 20, nullable: true })
    aadhaar_number: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    pan_number: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'int', nullable: true })
    verified_income: number;

    @Column({ type: 'int', nullable: true })
    professional_income: number;

    @Column({ type: 'int', nullable: true })
    abb: number;

    @Column({ type: 'int', nullable: true })
    amc: number;

    @Column({ type: 'int', nullable: true })
    banking_vintage_months: number;

    @Column({ type: 'int', nullable: true })
    bounces_6m: number;

    @Column({ type: 'tinyint', width: 1, default: 0 })
    live_usl: number;

    @Column({ type: 'int', nullable: true })
    verified_emi: number;

    @Column({ type: 'int', nullable: true })
    emi_count: number;

    @Column({ type: 'tinyint', width: 1, default: 0 })
    od_cc_present: number;

    @Column({ type: 'timestamp', nullable: true })
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    updated_at: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    city: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    cibil_band: string;
}
