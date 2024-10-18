import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/v1/dashboard')
// @UseGuards(RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('agents/count')
  // @Roles(Role.Admin) // Uncomment to restrict access to admin role only
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

  @Get('tickets/count')
  // @Roles(Role.Admin, Role.Sales)
  async findTicketsCount() {
    try {
      const count = await this.dashboardService.findTicketsCount();
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

  @Get('tickets/count/:status')
  // @Roles(Role.Admin, Role.Sales)
  async findTicketsCountByStatus(@Param('status') status: string) {
    try {
      const count = await this.dashboardService.findTicketsCount(status);
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
}
