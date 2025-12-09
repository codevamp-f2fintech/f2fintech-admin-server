import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

@Entity( 'ticket-activities' )
export class TicketActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticket_id: number;

  @ManyToOne( () => User )
  @JoinColumn( { name: 'user_id' } )
  user: User;

  @Column()
  @Index()
  user_id: number;

  @Column( { length: 250 } )
  comment: string;

  @Column( { nullable: true } )
  attachment: string | null;

  @Column( { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' } )
  created_at: Date;

  @Column( { name: 'company_id', nullable: true } )
  company_id: number | null;

  @Column( {
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  } )
  updated_at: Date;
}
