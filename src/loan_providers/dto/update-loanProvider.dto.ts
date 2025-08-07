// dto/update-loanProvider.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanProviderDto } from './create-loanProvider.dto';

export class UpdateLoanProviderDto extends PartialType( CreateLoanProviderDto ) { }
