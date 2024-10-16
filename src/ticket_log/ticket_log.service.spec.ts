import { Test, TestingModule } from '@nestjs/testing';
import { TicketLogService } from './ticket_log.service';

describe('TicketLogService', () => {
  let service: TicketLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketLogService],
    }).compile();

    service = module.get<TicketLogService>(TicketLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
