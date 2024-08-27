import { Test, TestingModule } from '@nestjs/testing';
import { TicketActivitiesController } from './ticket_activities.controller';
import { ActivitiesService } from './ticket_activities.service';
import { beforeEach, describe, it } from 'node:test';

describe('TicketActivitiesController', () => {
  let controller: TicketActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketActivitiesController],
      providers: [ActivitiesService],
    }).compile();

    controller = module.get<TicketActivitiesController>(
      TicketActivitiesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
