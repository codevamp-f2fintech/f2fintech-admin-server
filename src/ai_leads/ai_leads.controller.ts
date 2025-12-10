import { Controller, Get, Headers } from '@nestjs/common';
import { AiLeadsService } from './ai_leads.service';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1/')
export class AiLeadsController {
  constructor(private readonly aiLeadsService: AiLeadsService) { }

  @Get('get-ai-leads')
  async findAll ( @Headers( 'Companyid' ) companyIdString?: string ) {
    try {
      const companyId = companyIdString && !isNaN( Number( companyIdString ) )
        ? Number( companyIdString )
        : null;
      const leads = await this.aiLeadsService.findAll( companyId );
      return ResponseFormatter.success(
        200,
        'AI Leads retrieved successfully',
        leads,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
