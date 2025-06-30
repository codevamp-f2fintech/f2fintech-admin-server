import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTicketVoiceNoteDto } from './dto/create_ticket_voice_note.dto';
import { TicketVoiceNote } from './entities/ticket_voice_note.entity';

@Injectable()
export class TicketVoiceNoteService {
  constructor(
    @InjectRepository(TicketVoiceNote)
    private readonly ticketVoiceNoteRepository: Repository<TicketVoiceNote>,
  ) { }

  // Create a new voice note
  async create(createTicketVoiceNoteDto: CreateTicketVoiceNoteDto): Promise<TicketVoiceNote> {
    const newVoiceNote = this.ticketVoiceNoteRepository.create({
      ...createTicketVoiceNoteDto,
      created_at: new Date()
    });
    return await this.ticketVoiceNoteRepository.save(newVoiceNote);
  }

  // Retrieve all voice notes by ticket ID
  async findAllByTicketId(ticketId: number) {
    return await this.ticketVoiceNoteRepository.find({
      where: { ticket_id: ticketId },
      order: { created_at: 'DESC' }
    });
  }

  // Retrieve a single voice note by ticket_id
  async findOne(ticket_id: number): Promise<TicketVoiceNote> {
    const voiceNote = await this.ticketVoiceNoteRepository.findOne({ where: { ticket_id } });
    if (!voiceNote) {
      throw new NotFoundException(`Voice Note with ticket ID ${ticket_id} not found`);
    }
    return voiceNote;
  }

  // Delete an existing voice note by id
  async remove(id: number): Promise<void> {
    const voiceNote = await this.ticketVoiceNoteRepository.findOne({ where: { id } });;
    if (!voiceNote) {
      throw new NotFoundException(`Voice Note with id ${id} not found`);
    }
    await this.ticketVoiceNoteRepository.remove(voiceNote);
  }
}