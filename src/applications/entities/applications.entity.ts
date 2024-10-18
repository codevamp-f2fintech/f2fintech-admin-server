import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer_application')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: 'int' })
  tenure: number;

  @Column({ type: 'decimal' })
  interest_rate: number;

  @Column({ type: 'decimal' })
  emi_amount: number;

  @Column({ type: 'int' })
  emi_count: number;

  @Column({ type: 'date' })
  application_date: Date;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'timestamp' })
  last_updated: Date;
}
