import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadInfo } from './entities/leadInfo.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(LeadInfo)
    private leadsRepository: Repository<LeadInfo>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ results: LeadInfo[], count: number, pages: number }> {
    const skip = (page - 1) * limit;
    const [results, count] = await this.leadsRepository.findAndCount({
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
