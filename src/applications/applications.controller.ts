import { Controller, Get, Query, Param } from '@nestjs/common';
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

  @Get('get-status-and-documents/:customerId/:applicationId')
  async getStatusAndDocuments(
    @Param('customerId') customerId: string,
    @Param('applicationId') applicationId: string,
  ): Promise<any> {
    try {
      const data = await this.applicationsService.getCustomerStatusAndDocuments(
        customerId,
        applicationId,
      );

      return { success: true, data: data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
