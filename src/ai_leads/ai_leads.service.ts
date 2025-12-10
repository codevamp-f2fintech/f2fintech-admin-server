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

  async findAll ( companyId?: number ) {
    const query = this.aiLeadsRepository
      .createQueryBuilder( 'ai_leads' )
      .orderBy( 'ai_leads.application_date', 'DESC' );

    if ( companyId )
    {
      query.andWhere( 'ai_leads.company_id = :companyId', { companyId } );
    }
    return await this.aiLeadsRepository.find({
      order: { application_date: 'DESC' }
    });
  }
}
