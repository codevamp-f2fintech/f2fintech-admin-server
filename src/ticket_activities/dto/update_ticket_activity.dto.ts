import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketActivityDto } from './create_ticket_activity.dto';

export class UpdateTicketActivityDto extends PartialType(
  CreateTicketActivityDto,
) {}
