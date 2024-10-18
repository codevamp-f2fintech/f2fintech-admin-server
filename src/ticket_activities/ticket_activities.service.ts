import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketActivityDto } from './dto/create_ticket_activity.dto';
import { UpdateTicketActivityDto } from './dto/update_ticket_activity.dto';
import { TicketActivity } from './entities/ticket_activities.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(TicketActivity)
    private readonly activityRepository: Repository<TicketActivity>,
  ) {}

  // Create a new activity
  async create(createTicketActivityDto: CreateTicketActivityDto): Promise<TicketActivity> {
    const newActivity = this.activityRepository.create({
      ...createTicketActivityDto,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return await this.activityRepository.save(newActivity);
  }

  // Retrieve all activities by ticket ID
  async findAllByTicketId(ticketId: number) {
    return await this.activityRepository.find({
      where: { ticket_id: ticketId.toString() },
    });
  }
  

  // Retrieve a single activity by ticket_id
  async findOne(ticket_id: string): Promise<TicketActivity> {
    const activity = await this.activityRepository.findOne({ where: { ticket_id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ticket ID ${ticket_id} not found`);
    }
    return activity;
  }

  // Update an existing activity by ticket_id
  // Service method to update a ticket activity by ticket_id and id
// Service method to update a ticket activity by ticket_id and id
async updateByTicketIdAndId(
  ticket_id: string, 
  id: string, 
  updateTicketActivityDto: UpdateTicketActivityDto,
): Promise<TicketActivity> {
  // Convert id to a number
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    throw new BadRequestException(`Invalid ID format`);
  }

  // Find the activity using both ticket_id (string) and id (number)
  const activity = await this.activityRepository.findOne({ where: { ticket_id, id: numericId } });

  if (!activity) {
    throw new NotFoundException(`Activity with ticket ID ${ticket_id} and ID ${id} not found`);
  }

  // Update the activity fields
  Object.assign(activity, updateTicketActivityDto, { updated_at: new Date() });

  // Save and return the updated activity
  return await this.activityRepository.save(activity);
}



  // Delete an existing activity by ticket_id
  async remove(ticket_id: string): Promise<void> {
    const activity = await this.findOne(ticket_id);
    await this.activityRepository.remove(activity);
  }
}