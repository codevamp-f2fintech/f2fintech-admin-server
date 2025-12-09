import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Put,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';

import { LoanProviderService } from './loanProvider.service';
import { CreateLoanProviderDto } from './dto/create-loanProvider.dto';

import { ResponseFormatter } from 'src/common/utility/responseFormatter';
import { UpdateLoanProviderDto } from './dto/update-loanProvider.dto';

@Controller( 'api/v1' )
export class LoanProviderController {
  constructor ( private readonly LoanProviderService: LoanProviderService ) { }

  @Post( 'create-loan-provider' )
  async create ( @Body() createTicketDto: CreateLoanProviderDto ) {
    try
    {
      const newTicket = await this.LoanProviderService.create( createTicketDto );
      return ResponseFormatter.success(
        201,
        'Loan Provider created successfully',
        newTicket,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Put( 'update-loan-provider/:id' )
  async updateLoanProvider (
    @Param( 'id', ParseIntPipe ) id: number,
    @Body() updateDto: UpdateLoanProviderDto,
  ) {
    try
    {
      const updated = await this.LoanProviderService.updateLoanProvider(
        id,
        updateDto,
      );
      return ResponseFormatter.success(
        200,
        'Loan Provider updated successfully',
        updated,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get( 'get-all-loan-providers' )
  async getAllLoanProviders (
    @Query( 'page' ) page: number,
    @Query( 'limit' ) limit: number,
    @Query( 'country' ) country?: string,
    @Headers( 'Companyid' ) companyIdString?: string,
  ): Promise<any> {
    const companyId = companyIdString && !isNaN( Number( companyIdString ) )
      ? Number( companyIdString )
      : null;
    if ( !companyId )
    {
      return ResponseFormatter.error(
        400,
        'Company ID is required in headers'
      );
    }
    const paginatedTickets = await this.LoanProviderService.getAllLoanProviders(
      page,
      limit,
      country,
      companyId
    );
    return ResponseFormatter.success( 200, 'Tickets Retrieved Successfully', paginatedTickets );
  }


  @Get( 'get-loan-provider-by-id/:id' )
  async findOne ( @Param( 'id' ) id: string ) {
    const numericId = parseInt( id, 10 );
    if ( Number.isNaN( numericId ) )
    {
      return ResponseFormatter.error( 400, 'Invalid id parameter' );
    }

    const loanProvider = await this.LoanProviderService.findOne( numericId );
    if ( !loanProvider )
    {
      return ResponseFormatter.error( 404, 'Loan Provider not found' );
    }

    return ResponseFormatter.success( 200, 'Loan Provider Retrieved Successfully', loanProvider );
  }

  @Delete( 'delete-loan-provider/:id' )
  async deleteLoanProvider ( @Param( 'id' ) id: number ): Promise<any> {
    try
    {
      const result = await this.LoanProviderService.deleteLoanProvider( id );
      return ResponseFormatter.success(
        200,
        'Loan Provider deleted successfully',
        result,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
