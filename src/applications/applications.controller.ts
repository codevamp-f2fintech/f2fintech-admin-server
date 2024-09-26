import { Controller, Get, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

@Controller('customer-applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('get-loan-applications')
  async getLoanApplications(
    @Query('page') page: number = 1,
    @Query('offset') offset: number = 6,
  ): Promise<any> {
    try {
      const data = await this.applicationsService.getCustomerData(page, offset);
      return { success: true, data: data.data, totalCount: data.totalCount };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
