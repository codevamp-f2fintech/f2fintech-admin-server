import { Application } from 'src/applications/entities/applications.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity( 'companies' )
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column( { name: 'contact_number' } )
    contactNumber: string;
    
    
    @Column( { nullable: true } )
    website: string;
    
    @Column( { type: 'text', nullable: true } )
    address: string;
    
    @Column( { type: 'text', nullable: true } )
    description: string;
    
    @Column( { default: true, name: 'is_active' } )
    isActive: boolean;
    
    @Column( { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' } )
    created_at: Date;
    
    @Column( {
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    } )

    @Column( { name: 'company_id', unique: true } )
    companyId: string;
    updated_at: Date;

    // Add these relationships
    @OneToMany( () => Application, ( application ) => application.company )
    applications: Application[];

    @OneToMany( () => Ticket, ( ticket ) => ticket.company )
    tickets: Ticket[];

    @OneToMany( () => User, ( user ) => user.company )
    users: User[];
}