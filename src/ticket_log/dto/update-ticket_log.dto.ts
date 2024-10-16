import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketLogDto } from './create-ticket_log.dto';

export class UpdateTicketLogDto extends PartialType(CreateTicketLogDto) { }
