import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthService } from './health.service';
import { Role } from 'src/common/enum/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('health')
@UseGuards(RolesGuard)
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get('check')
  checkHealth() {
    return this.healthService.check();
  }
}
