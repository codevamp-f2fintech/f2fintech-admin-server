import { Injectable, NotFoundException } from '@nestjs/common';
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
  async create(
    createTicketActivityDto: CreateTicketActivityDto,
  ): Promise<TicketActivity> {
    const newactivity = this.activityRepository.create({
      ...createTicketActivityDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.activityRepository.save(newactivity);
  }

  // Retrieve all activities
  async findAll(): Promise<TicketActivity[]> {
    return await this.activityRepository.find();
  }

  // Retrieve a single activity by ID
  async findOne(id: number): Promise<TicketActivity> {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  // Update an existing activity by ID
  async update(
    id: number,
    updateTicketActivityDto: UpdateTicketActivityDto,
  ): Promise<TicketActivity> {
    const activity = await this.findOne(id);
    Object.assign(activity, updateTicketActivityDto, { updatedAt: new Date() });
    return await this.activityRepository.save(activity);
  }
}
