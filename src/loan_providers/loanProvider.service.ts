import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateLoanProviderDto } from './dto/create-loanProvider.dto';
import { LoanProvider } from './entities/loanProvider.entity';
import { UpdateLoanProviderDto } from './dto/update-loanProvider.dto';

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

  async updateLoanProvider (
    id: number,
    updateDto: UpdateLoanProviderDto,
  ): Promise<any> {
    try
    {
      // Option A: use preload (recommended — merges and returns entity or undefined)
      const preloaded = await this.LoanProviderRepository.preload( {
        id,
        ...updateDto,
      } );

      if ( !preloaded )
      {
        throw new NotFoundException( 'Loan Provider not found' );
      }

      const saved = await this.LoanProviderRepository.save( preloaded );

      return {
        statusCode: 200,
        message: 'Updated Successfully',
        data: saved,
      };
    } catch ( error )
    {
      if ( error instanceof NotFoundException )
      {
        throw error; // let controller ResponseFormatter handle
      }
      return {
        statusCode: 500,
        message: 'Error updating Loan Provider',
        error,
      };
    }
  }

  async getAllLoanProviders (
    page: number,
    limit: number,
    country?: string,
    // companyId?: number,
  ): Promise<PaginationResult> {
    page = Number( page ) || 1;
    limit = Number( limit ) || 10;

    const whereConditions: any = {};

    // Always filter by companyId if provided
    // if ( companyId )
    // {
    //   whereConditions.company_id = companyId;
    // } else
    // {
    //   // If no companyId provided, you might want to return empty or throw error
    //   throw new Error( 'Company ID is required' );
    // }

    if ( country )
    {
      whereConditions.country = country;
    }

    const [ results, count ] = await this.LoanProviderRepository.findAndCount( {
      where: whereConditions,
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

  async findOne ( id: number ): Promise<any> {
    const loanProvider = await this.LoanProviderRepository.findOne( { where: { id } } );
    if ( !loanProvider )
    {
      throw new NotFoundException( 'Loan Provider not found' );
    }
    return loanProvider;
  }

  async deleteLoanProvider ( id: number ): Promise<any> {
    try
    {
      // First, check if the loan provider exists
      const loanProvider = await this.LoanProviderRepository.findOne( {
        where: { id }
      } );

      if ( !loanProvider )
      {
        throw new NotFoundException( 'Loan Provider not found' );
      }

      // Delete the loan provider
      const deleteResult = await this.LoanProviderRepository.delete( id );

      if ( deleteResult.affected === 0 )
      {
        throw new NotFoundException( 'Loan Provider not found or already deleted' );
      }

      return {
        statusCode: 200,
        message: 'Loan Provider deleted successfully',
        data: { id, deletedAt: new Date() }
      };
    } catch ( error )
    {
      if ( error instanceof NotFoundException )
      {
        throw error;
      }
      return {
        statusCode: 500,
        message: 'Error deleting Loan Provider',
        error
      };
    }
  }
}
