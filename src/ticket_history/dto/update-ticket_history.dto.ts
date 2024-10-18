import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketHistoryDto } from './create-ticket_history.dto';

export class UpdateTicketHistoryDto extends PartialType(
    CreateTicketHistoryDto
) { }
