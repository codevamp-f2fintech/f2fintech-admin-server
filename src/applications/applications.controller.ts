import { Controller, Get, Query, Param, Patch, Body } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1/')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Get('get-loan-applications')
  async getLoanApplications(
    @Query('page') page: number = 1,
    @Query('offset') offset: number = 6,
  ): Promise<any> {
    try {
      const data = await this.applicationsService.getApplicationData(
        page,
        offset,
      );
      return { success: true, data: data.data, totalCount: data.totalCount };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('get-application-as-ticket/:applicationId')
  async getApplicationsAsTickets(
    @Param('applicationId') applicationId: string,
  ): Promise<any> {
    try {
      const data =
        await this.applicationsService.getApplicationsAsTickets(applicationId);
      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('application/count')
  async getApplicationsCount(): Promise<any> {
    try {
      const count = await this.applicationsService.getApplicationsCount();
      return ResponseFormatter.success(
        200,
        'Application count retrieved successfully',
        count,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
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

  @Patch('update-loan-application/:id')
  // @Roles(Role.Admin, Role.Sales)
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
