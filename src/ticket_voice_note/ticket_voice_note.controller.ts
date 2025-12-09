import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';

import { TicketVoiceNoteService } from './ticket_voice_note.service';
import { CreateTicketVoiceNoteDto } from './dto/create_ticket_voice_note.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller( 'api/v1/' )
@UseGuards( RolesGuard )
export class TicketVoiceNoteController {
  constructor ( private readonly activitiesService: TicketVoiceNoteService ) { }

  @Post( 'create-ticket-voice-note' )
  async create (
    @Body() createTicketVoiceNoteDto: CreateTicketVoiceNoteDto,
    @Headers( 'companyId' ) companyId: string,
  ) {
    try
    {
      const newVoiceNote = await this.activitiesService.create(
        createTicketVoiceNoteDto,
        companyId,
      );
      return ResponseFormatter.success(
        201,
        'Ticket voice note created successfully',
        newVoiceNote,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get( 'get-ticket-voice-notes/:ticketId' )
  async findAll (
    @Param( 'ticketId' ) ticketId: number,
    @Headers( 'companyId' ) companyId: string,
  ) {
    try
    {
      const voiceNotes = await this.activitiesService.findAllByTicketId(
        ticketId,
        companyId, // Pass companyId to service
      );
      return ResponseFormatter.success(
        200,
        'Ticket Voice Notes retrieved successfully',
        voiceNotes,
      );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Delete( 'delete-ticket-voice-note/:id' )
  async remove ( @Param( 'id' ) id: number ) {
    try
    {
      await this.activitiesService.remove( id );
      return ResponseFormatter.success( 200, 'Ticket voice note deleted successfully' );
    } catch ( error )
    {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
