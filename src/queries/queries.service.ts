import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendQuery } from './entities/sendQuery.entity';

@Injectable()
export class QueriesService {
  constructor(
    @InjectRepository(SendQuery)
    private readonly queriesRepository: Repository<SendQuery>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ results: SendQuery[], count: number, pages: number }> {
    const skip = (page - 1) * limit;
    const [results, count] = await this.queriesRepository.findAndCount({
      order: {
        id: 'DESC',
      },
      skip,
      take: limit,
    });

    return {
      results,
      count,
      pages: Math.ceil(count / limit),
    };
  }
}
