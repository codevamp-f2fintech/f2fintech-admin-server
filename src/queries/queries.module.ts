import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueriesService } from './queries.service';
import { QueriesController } from './queries.controller';
import { SendQuery } from './entities/sendQuery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SendQuery])],
  controllers: [QueriesController],
  providers: [QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
