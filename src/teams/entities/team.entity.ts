import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('teams')
@Unique(['member_id', 'level', 'role'])
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'member_id' })
  member_id: number;

  @Column({ name: 'supervisor_id' })
  supervisor_id: number;

  @Column({ type: 'enum', enum: ['l1', 'l2'] })
  level: 'l1' | 'l2';

  @Column({ type: 'varchar', length: 50, default: 'sales' })
  role: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor: User;
}
