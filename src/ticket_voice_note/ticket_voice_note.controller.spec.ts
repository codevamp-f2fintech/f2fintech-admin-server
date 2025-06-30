import { Test, TestingModule } from '@nestjs/testing';
import { TicketVoiceNoteController } from './ticket_voice_note.controller';
import { TicketVoiceNoteService } from './ticket_voice_note.service';
import { beforeEach, describe, it } from 'node:test';

describe('TicketVoiceNoteController', () => {
  let controller: TicketVoiceNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketVoiceNoteController],
      providers: [TicketVoiceNoteService],
    }).compile();

    controller = module.get<TicketVoiceNoteController>(
      TicketVoiceNoteController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
