import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule, // Import TerminusModule
    HttpModule, // Import HttpModule from @nestjs/axios
  ],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
