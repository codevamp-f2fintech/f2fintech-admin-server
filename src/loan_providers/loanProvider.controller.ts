import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';

import { LoanProviderService } from './loanProvider.service';
import { CreateLoanProviderDto } from './dto/create-loanProvider.dto';

import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1')
export class LoanProviderController {
  constructor(private readonly LoanProviderService: LoanProviderService) { }

  @Post('create-loan-provider')
  async create ( @Body() createTicketDto: CreateLoanProviderDto ) {
    try {
      const newTicket = await this.LoanProviderService.create(createTicketDto);
      return ResponseFormatter.success(
        201,
        'Loan Provider created successfully',
        newTicket,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('get-all-loan-providers')
  async getAllLoanProviders(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('country') country?: string,
  ): Promise<any> {
    const paginatedTickets = await this.LoanProviderService.getAllLoanProviders(
      page,
      limit,
      country,
    );
    return ResponseFormatter.success(200, 'Tickets Retrieved Successfully', paginatedTickets);
  }
}
