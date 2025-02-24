import { Test, TestingModule } from '@nestjs/testing';
import { LoanProviderController } from './loanProvider.controller';
import { LoanProviderService } from './loanProvider.service';

describe('LoanProviderControler', () => {
  let controller: LoanProviderControler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanProviderControler],
      providers: [LoanProviderService],
    }).compile();

    controller = module.get<LoanProviderControler>(LoanProviderControler);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
