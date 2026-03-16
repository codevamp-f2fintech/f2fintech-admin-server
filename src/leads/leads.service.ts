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

  async findAll(): Promise<LeadInfo[]> {
    return await this.leadsRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}
