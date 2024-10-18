import { Test, TestingModule } from '@nestjs/testing';
import { TicketHistoryController } from './ticket_history.controller';
import { TicketHistoryService } from './ticket_history.service';

describe('TicketHistoryController', () => {
  let controller: TicketHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketHistoryController],
      providers: [TicketHistoryService],
    }).compile();

    controller = module.get<TicketHistoryController>(TicketHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
