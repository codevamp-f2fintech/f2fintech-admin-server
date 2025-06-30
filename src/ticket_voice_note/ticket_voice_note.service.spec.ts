import { Test, TestingModule } from '@nestjs/testing';
import { TicketVoiceNoteService } from './ticket_voice_note.service';
import { beforeEach, describe, it } from 'node:test';

describe('TicketVoiceNoteService', () => {
  let service: TicketVoiceNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketVoiceNoteService],
    }).compile();

    service = module.get<TicketVoiceNoteService>(TicketVoiceNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
