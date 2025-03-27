import { Test, TestingModule } from '@nestjs/testing';
import { LoanProviderService } from './loanProvider.service';

describe('LoanProviderService', () => {
  let service: LoanProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanProviderService],
    }).compile();

    service = module.get<LoanProviderService>(LoanProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
