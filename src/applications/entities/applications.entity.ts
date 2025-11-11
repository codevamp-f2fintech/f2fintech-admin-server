import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';

import { Ticket } from 'src/tickets/entities/ticket.entity';
import { Customer } from './customer.entity';
import { LoanTracking } from './loanTracking.entity';

export enum Loan_type {
  TERM_LOAN = 'term loan',
  PERSONAL_LOAN = 'personal loan',
  BUSINESS_LOAN = 'business loan',
  PROFESSIONAL_LOAN = 'professional loan',
  HOME_LOAN = 'home loan',
  EDUCATION_LOAN = 'education loan',
  LAP = 'lap',
  MACHINERY_LOAN = 'machinery loan',
  AUTO_LOAN = 'auto loan'
}

export enum Loan_category {
  SECURED = 'secured',
  UNSECURED = 'unsecured'
}

@Entity( 'customer_application' )
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( { type: 'int' } )
  customer_id: number;

  @Column( { type: 'int' } )
  applied_by: number;

  @Column( { type: 'int' } )
  application_no: number;

  @Column( { length: 500 } )
  provider: string;

  @Column( { type: 'decimal' } )
  amount: number;

  @Column( {
    type: 'enum',
    enum: Loan_type,
  } )
  loan_type: Loan_type;

  @Column( {
    type: 'enum',
    enum: Loan_category,
  } )
  loan_category: Loan_category;

  @Column( { type: 'int' } )
  tenure: number;

  @Column( { type: 'decimal' } )
  interest_rate: number;

  @Column( { type: 'decimal' } )
  emi_amount: number;

  @Column( { type: 'int' } )
  emi_count: number;

  @Column( {
    type: 'tinyint',
    width: 1,
    default: 0,
  } )
  is_picked: number;

  @Column( { type: 'date' } )
  application_date: Date;

  @Column( { type: 'date' } )
  start_date: Date;

  @Column( { type: 'date' } )
  end_date: Date;

  @CreateDateColumn( { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' } )
  last_updated: Date;

  @OneToOne( () => Ticket, ( ticket ) => ticket.application )
  ticket: Ticket;

  @ManyToOne( () => Customer, ( customer ) => customer.applications )
  @JoinColumn( { name: 'customer_id' } )
  customer: Customer;

  @OneToMany( () => LoanTracking, ( tracking ) => tracking.application )
  loanTracking: LoanTracking[];
}
