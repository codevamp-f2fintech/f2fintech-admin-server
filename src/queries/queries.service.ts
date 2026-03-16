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

  async findAll(): Promise<SendQuery[]> {
    return await this.queriesRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}
