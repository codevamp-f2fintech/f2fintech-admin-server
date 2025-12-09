import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';

import { CustomerInfo } from './customerInfo.entity';
import { CustomerDocument } from './customerDocuments.entity';
import { Application } from './applications.entity';

@Entity( 'customer' )
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { type: 'varchar', length: 50 } )
    name: string;

    @Column( { type: 'varchar', length: 255 } )
    password: string;

    @Column( { type: 'varchar', length: 100 } )
    email: string;

    @Column( { type: 'varchar', length: 50 } )
    contact: string;

    @Column( {
        type: 'enum',
        enum: [ 'male', 'female', 'other' ]
    } )
    gender: 'male' | 'female' | 'other';

    @Column( {
        type: 'enum',
        enum: [ 'active', 'inactive' ],
        default: 'active',
    } )
    status: 'active' | 'inactive';

    @Column( { type: 'date', nullable: true } )
    dob: Date;

    @CreateDateColumn( { type: 'timestamp' } )
    created_at: Date;

    @OneToMany( () => CustomerDocument, ( doc ) => doc.customer )
    customerDocuments: CustomerDocument[];

    @OneToOne( () => CustomerInfo, ( info ) => info.customer )
    info: CustomerInfo;

    @OneToMany( () => Application, ( app ) => app.customer )
    applications: Application[];
}
