import { IsNotEmpty, IsNumber, IsEnum, IsString, IsOptional } from 'class-validator';

export class AssignMemberDto {
  @IsNotEmpty()
  @IsNumber()
  memberId: number;

  @IsNotEmpty()
  @IsNumber()
  supervisorId: number;

  @IsNotEmpty()
  @IsEnum(['l1', 'l2'])
  level: 'l1' | 'l2';

  @IsOptional()
  @IsString()
  role?: string = 'sales';
}
