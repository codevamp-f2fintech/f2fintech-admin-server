import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTicketHistoryDto {
    @IsNotEmpty()
    @IsNumber()
    ticket_id: number;

    @IsString()
    action: string;
}
