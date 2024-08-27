import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './ticket_activities.service';
import { beforeEach, describe, it, expect } from 'node:test';

describe('ActivitiesService', () => {
  let service: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivitiesService],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
