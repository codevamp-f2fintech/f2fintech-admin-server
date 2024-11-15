import { BadRequestException, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { ResponseFormatter } from 'src/common/utility/responseFormatter';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('api/v1/dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('agents/count')
  async findAgentCount() {
    try {
      const count = await this.dashboardService.findAgentCount();
      return ResponseFormatter.success(
        200,
        'Agent count retrieved successfully',
        count,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('tickets/count/:idOrStatus?/:status?')
  async findTicketsCount(
    @Param('idOrStatus') idOrStatus?: string,
    @Param('status') status?: string,
  ) {
    try {
      let count = 0;
      if (idOrStatus && status) {
        // idOrStatus is treated as an ID, and status is provided
        count = await this.dashboardService.findTicketsCount(idOrStatus, status);
      } else if (idOrStatus && !isNaN(Number(idOrStatus))) {
        // idOrStatus is a number, so treat it as an ID with no status
        count = await this.dashboardService.findTicketsCount(idOrStatus);
      } else if (idOrStatus && isNaN(Number(idOrStatus))) {
        // idOrStatus is a string and not a number, so treat it as a status
        count = await this.dashboardService.findTicketsCount(null, idOrStatus);
      } else {
        // no parameters, return total count
        count = await this.dashboardService.findTicketsCount();
      }

      return ResponseFormatter.success(
        200,
        'Tickets count retrieved successfully',
        count,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('tickets/counts-by-month')
  async getTotalTicketsByMonth(@Query('year') year: string) {
    const yearInt = parseInt(year);
    if (isNaN(yearInt)) {
      throw new BadRequestException('Invalid year');
    }

    try {
      const result = await this.dashboardService.getTotalTicketsByMonth(yearInt);
      return ResponseFormatter.success(200, 'Total tickets by month retrieved successfully', result);
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('tickets/done-counts-by-month')
  async getDoneTicketsByMonth(@Query('year') year: string) {
    const yearInt = parseInt(year);
    if (isNaN(yearInt)) {
      throw new BadRequestException('Invalid year');
    }

    try {
      const result = await this.dashboardService.getDoneTicketsByMonth(yearInt);
      return ResponseFormatter.success(200, 'Done tickets by month retrieved successfully', result);
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
