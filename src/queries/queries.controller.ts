import { Controller, Get } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1/queries')
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  @Get()
  async findAll() {
    try {
      const queries = await this.queriesService.findAll();
      return ResponseFormatter.success(200, 'Queries retrieved successfully', queries);
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
