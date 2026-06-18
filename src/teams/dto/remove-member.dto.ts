import { IsNotEmpty, IsNumber, IsEnum, IsString, IsOptional } from 'class-validator';

export class RemoveMemberDto {
  @IsNotEmpty()
  @IsNumber()
  memberId: number;

  @IsNotEmpty()
  @IsEnum(['l1', 'l2'])
  level: 'l1' | 'l2';

  @IsOptional()
  @IsString()
  role?: string = 'sales';
}
