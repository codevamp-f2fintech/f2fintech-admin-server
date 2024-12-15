import { Controller, Get, Query, Param, Patch, Body } from '@nestjs/common';

import { ApplicationsService } from './applications.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Get('get-customer-loan-applications')
  async getLoanApplications(
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<any> {
    const customerApplications = await this.applicationsService.getApplicationData(page, limit);
    return ResponseFormatter.success(200, 'Applications Retrieved Successfully', customerApplications);
  }

  @Get('application/count')
  async getApplicationsCount(): Promise<any> {
    const count = await this.applicationsService.getApplicationsCount();
    return ResponseFormatter.success(
      200,
      'Application Count retrieved successfully',
      count,
    );
  }

  @Get('get-status-and-documents/:customerId/:applicationId')
  async getStatusAndDocuments(
    @Param('customerId') customerId: number,
    @Param('applicationId') applicationId: number,
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

  @Patch('update-loan-application/:id')
  async update(
    @Param('id') id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    try {
      await this.applicationsService.update(
        +id,
        updateApplicationDto,
      );
      return ResponseFormatter.success(200, 'Application updated successfully');
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
