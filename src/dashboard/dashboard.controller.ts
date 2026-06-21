import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';

import { ResponseFormatter } from 'src/common/utility/responseFormatter';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('api/v1/dashboard')
@UseGuards(RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('agents/count')
  async findAgentCount(
    @Headers('Companyid') companyId?: string,
  ) {
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

  @Get('tickets/count')
  async findTicketsCount(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Headers('Companyid') companyId?: string,
  ) {
    try {
      // Convert userId to number if it exists and is a valid number
      const companyIdNumber = companyId && !isNaN(Number(companyId)) ? Number(companyId) : null;

      let userIdParam: number | number[] | null = null;
      if (userId) {
        if (userId.includes(',')) {
          userIdParam = userId.split(',').map(id => Number(id)).filter(id => !isNaN(id));
        } else if (!isNaN(Number(userId))) {
          userIdParam = Number(userId);
        }
      }

      const result = await this.dashboardService.findTicketsCount(
        userIdParam,
        status || null,
        date || null,
        month || null,
        year || null,
        companyIdNumber,
      );

      return ResponseFormatter.success(
        200,
        'Tickets result and amount retrieved successfully',
        result,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('tickets/aggregate-counts')
  async getAggregateTicketsCount(
    @Query('userId') userId?: string,
    @Query('date') date?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Headers('Companyid') companyId?: string,
  ) {
    try {
      const companyIdNumber = companyId && !isNaN(Number(companyId)) ? Number(companyId) : null;

      let userIdParam: number | number[] | null = null;
      if (userId) {
        if (userId.includes(',')) {
          userIdParam = userId.split(',').map(id => Number(id)).filter(id => !isNaN(id));
        } else if (!isNaN(Number(userId))) {
          userIdParam = Number(userId);
        }
      }

      const result = await this.dashboardService.getAggregateTicketCounts(
        userIdParam,
        date || null,
        month || null,
        year || null,
        companyIdNumber,
      );

      return ResponseFormatter.success(
        200,
        'Aggregate ticket counts retrieved successfully',
        result,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  // Keep the old route structure for backward compatibility if needed
  @Get('tickets/count/:userId/:status?')
  async findTicketsCountLegacy(
    @Param('userId') userId: string,
    @Param('status') status?: string,
    @Query('date') date?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    try {
      // Convert userId to number if it's a valid number, otherwise treat as status
      let userIdNumber: number | null = null;
      let finalStatus = status;

      if (!isNaN(Number(userId))) {
        userIdNumber = Number(userId);
      } else {
        // userId is actually a status
        finalStatus = userId;
        userIdNumber = null;
      }

      const result = await this.dashboardService.findTicketsCount(
        userIdNumber,
        finalStatus || null,
        date || null,
        month || null,
        year || null,
      );

      return ResponseFormatter.success(
        200,
        'Tickets result and amount retrieved successfully',
        result,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }


  @Get('tickets/counts-by-month')
  async getTotalTicketsByMonth(@Query('year') year: string, @Query('companyId') companyId?: string,) {
    const yearInt = parseInt(year);
    if (isNaN(yearInt)) {
      throw new BadRequestException('Invalid year');
    }

    try {
      const companyIdNumber = companyId && !isNaN(Number(companyId)) ? Number(companyId) : null;
      const result =
        await this.dashboardService.getTotalTicketsByMonth(yearInt, companyIdNumber,);
      return ResponseFormatter.success(
        200,
        'Total tickets by month retrieved successfully',
        result,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('tickets/done-counts-by-month')
  async getDoneTicketsByMonth(@Query('year') year: string, @Query('companyId') companyId?: string,) {
    const yearInt = parseInt(year);
    if (isNaN(yearInt)) {
      throw new BadRequestException('Invalid year');
    }

    try {
      const companyIdNumber = companyId && !isNaN(Number(companyId)) ? Number(companyId) : null;
      const result = await this.dashboardService.getDoneTicketsByMonth(yearInt, companyIdNumber);
      return ResponseFormatter.success(
        200,
        'Done tickets by month retrieved successfully',
        result,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
