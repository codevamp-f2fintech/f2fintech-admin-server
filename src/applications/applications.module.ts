import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/applications.entity';
import { LoanTracking } from 'src/applications/entities/loanTracking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerInfo } from './entities/customerInfo.entity';

@Module( {
  imports: [ HttpModule, TypeOrmModule.forFeature( [ Application, Customer, CustomerInfo, LoanTracking ] ) ],
  controllers: [ ApplicationsController ],
  providers: [ ApplicationsService ],
  exports: [ ApplicationsService ],
} )
export class ApplicationsModule { }
