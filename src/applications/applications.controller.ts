import { Controller, Get, Query, Param, Patch, Body, Delete } from '@nestjs/common';

import { ApplicationsService } from './applications.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';
import { Headers } from '@nestjs/common';

@Controller('api/v1')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Get('get-customer-loan-applications')
  async getLoanApplications(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('appliedBy') appliedBy?: number,
    @Query('aggregatorMemberId') aggregatorMemberId?: string,
    @Query('search') searchTerm?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Headers('companyid') companyIdString?: string
  ): Promise<any> {
    const customerApplications = await this.applicationsService.getApplicationData(page, limit, appliedBy, aggregatorMemberId, searchTerm, companyIdString, startDate, endDate);
    return ResponseFormatter.success(200, 'Applications Retrieved Successfully', customerApplications);
  }

  @Get('application/count')
  async getApplicationsCount(
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('date') date?: string,
    @Headers('Companyid') companyIdString?: string
  ): Promise<any> {
    try {
      const yearNum = year ? parseInt(year, 10) : undefined;
      const count = await this.applicationsService.getApplicationsCount(month, yearNum, date, companyIdString);

      return {
        success: true,
        data: count,
        message: 'Applications count retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve applications count',
        error: error.message
      };
    }
  }

  @Get('application/new-count')
  async getNewApplicationsCount(
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('date') date?: string,
    @Headers('Companyid') companyIdString?: string
  ) {
    try {
      const yearNum = year ? parseInt(year, 10) : undefined;
      const count = await this.applicationsService.getNewApplicationsCount(month, yearNum, date, companyIdString);

      return {
        success: true,
        data: count,
        message: 'New applications count retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve new applications count',
        error: error.message
      };
    }
  }

  @Get('application/new-applications')
  async getNewApplicationsList(
    @Query('limit') limit?: number,
    @Headers('Companyid') companyIdString?: string
  ) {
    try {
      const limitNum = limit ? Number(limit) : 10;
      const applications = await this.applicationsService.getNewApplicationsList(limitNum, companyIdString);
      return {
        success: true,
        data: applications,
        message: 'New applications retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to retrieve new applications',
        error: error.message
      };
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

  @Delete('delete-loan-application/:applicationId')
  async remove(@Param('applicationId') applicationId: number) {
    try {
      if (!applicationId || isNaN(applicationId)) {
        throw new Error('Invalid application ID');
      }

      await this.applicationsService.remove(applicationId); // Changed from delete() to remove()
      return ResponseFormatter.success(200, 'Application deleted successfully');
    } catch (error) {
      console.error('Error deleting application:', error);
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}