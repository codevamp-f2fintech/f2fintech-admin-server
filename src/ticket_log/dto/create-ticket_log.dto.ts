import { IsNotEmpty, IsString, IsNumber, IsOptional, IsInt } from 'class-validator';

export class CreateTicketLogDto {
    @IsNotEmpty()
    @IsNumber()
    ticket_id: number;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsString()
    time_spent: string;

    @IsString()
    work_description: string;

    @IsOptional()
    @IsInt()
    company_id?: number;
}
