import { Test, TestingModule } from '@nestjs/testing';
import { TicketLogController } from './ticket_log.controller';
import { TicketLogService } from './ticket_log.service';

describe('TicketLogController', () => {
  let controller: TicketLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketLogController],
      providers: [TicketLogService],
    }).compile();

    controller = module.get<TicketLogController>(TicketLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
