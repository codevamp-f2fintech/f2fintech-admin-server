import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateLoanProviderDto } from './dto/create-loanProvider.dto';
import { LoanProvider } from './entities/loanProvider.entity';

export interface PaginationResult {
  results: any[];
  count: number;
  pages: number;
  errorMessage?: string;
}

@Injectable()
export class LoanProviderService {
  constructor (
    @InjectRepository( LoanProvider )
    private readonly LoanProviderRepository: Repository<LoanProvider>
  ) { }

  async create ( CreateLoanProviderDto: CreateLoanProviderDto ): Promise<any> {
    try
    {
      const newTicket = this.LoanProviderRepository.create( CreateLoanProviderDto );
      await this.LoanProviderRepository.save( newTicket );
      return {
        statusCode: 201,
        message: 'Created Successfully',
        data: newTicket,
      };
    } catch ( error )
    {
      return {
        statusCode: 500,
        message: 'Error Creating LoanProvider',
        error
      };
    }
  }

  async getAllLoanProviders (
    page: number,
    limit: number,
    country?: string,
  ): Promise<PaginationResult> {
    page = Number( page ) || 1;
    limit = Number( limit ) || 10;

    const [ results, count ] = await this.LoanProviderRepository.findAndCount( {
      where: { country },
      skip: ( page - 1 ) * limit,
      take: limit,
      order: { created_at: "DESC" },
    } );
    return {
      results,
      count,
      pages: Math.ceil( count / limit ),
    };
  }

}
