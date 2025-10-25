import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AiLeads } from './entities/aiLeads.entity';

@Injectable()
export class AiLeadsService {
  constructor(
    @InjectRepository(AiLeads)
    private readonly aiLeadsRepository: Repository<AiLeads>,
  ) { }

  async findAll() {
    return await this.aiLeadsRepository.find({
      order: { application_date: 'DESC' }
    });
  }
}
