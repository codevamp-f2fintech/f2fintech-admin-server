import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

@Entity('loan_provider')
export class LoanProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  max_tenure: number;

  @Column()
  min_amount: number;

  @Column()
  max_amount: number;

  @Column({
    type: 'bit',
    width: 1, // BIT column
    default: 0, // Default to 0, representing false
  })
  is_home: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  home_image: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  interest_rate: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  short_description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  long_description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  charges: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  minimum_kyc: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  document_required: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}
