import { Controller, Get, Param, Query, Headers, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1')
@UseGuards(RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get('get-all-notifications')
  async getNotifications(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Headers('Companyid') companyIdString?: string,
  ) {
    try {
      const companyId = companyIdString && !isNaN(Number(companyIdString))
        ? Number(companyIdString)
        : null;

      const limitNum = limit ? parseInt(limit, 10) : 20;
      const pageNum = page ? parseInt(page, 10) : 1;

      const result = await this.notificationsService.getAdminNotifications(companyId, limitNum, pageNum);

      return ResponseFormatter.success(200, 'Notifications fetched successfully', result);
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('get-notification-by-id/:id')
  async getNotificationById(@Param('id') id: string) {
    try {
      const notification = await this.notificationsService.getNotificationById(+id);
      return ResponseFormatter.success(200, 'Notification fetched successfully', notification);
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
