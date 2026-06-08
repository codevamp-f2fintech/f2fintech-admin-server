import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id', type: 'int', nullable: true })
  customer_id: number;

  @Column({ name: 'company_id', type: 'int', default: 42 })
  company_id: number;

  @Column({ name: 'message', type: 'varchar', nullable: true })
  message: string;

  @Column({
    type: 'enum',
    enum: ['loan', 'query', 'general', 'ticket'],
  })
  type: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'sent', 'error', 'read'],
    default: 'pending',
  })
  status: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  user_id: number;

  @Column({ name: 'ticket_id', type: 'int', nullable: true })
  ticket_id: number;

  @Column({ name: 'old_status', type: 'varchar', nullable: true })
  old_status: string;

  @Column({ name: 'new_status', type: 'varchar', nullable: true })
  new_status: string;

  @Column({ name: 'title', type: 'varchar', nullable: true })
  title: string;

  @BeforeInsert()
  setCreatedAt() {
    this.created_at = new Date();
  }
}
