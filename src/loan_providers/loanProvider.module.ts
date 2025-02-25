import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoanProvider } from './entities/loanProvider.entity';
import { LoanProviderController } from './loanProvider.controller';
import { LoanProviderService } from './loanProvider.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature( [ LoanProvider ])
  ],
  controllers: [ LoanProviderController ],
  providers: [ LoanProviderService ],
  exports: [ LoanProviderService ],
})

export class LoanProvidersModule { }
