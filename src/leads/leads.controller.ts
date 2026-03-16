import { Controller, Get } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  async findAll() {
    try {
      const leads = await this.leadsService.findAll();
      return ResponseFormatter.success(200, 'Leads retrieved successfully', leads);
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
