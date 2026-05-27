import { Controller, Get, Query } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) { }

  @Get('get-all-queries')
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    try {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const queries = await this.queriesService.findAll(pageNum, limitNum);
      return ResponseFormatter.success(200, 'Queries retrieved successfully', queries);
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
