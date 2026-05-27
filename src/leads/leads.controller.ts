import { Controller, Get, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Get('get-all-leads')
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    try {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const leads = await this.leadsService.findAll(pageNum, limitNum);
      return ResponseFormatter.success(200, 'Leads retrieved successfully', leads);
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
