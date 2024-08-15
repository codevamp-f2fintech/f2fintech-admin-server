import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketActivityDto } from './dto/create-ticket_activity.dto';
import { UpdateTicketActivityDto } from './dto/update-ticket_activity.dto';
import { Activity } from './entities/ticket_activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  // Create a new activity
  async create(
    createTicketActivityDto: CreateTicketActivityDto,
  ): Promise<Activity> {
    const newactivity = this.activityRepository.create({
      ...createTicketActivityDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.activityRepository.save(newactivity);
  }

  // Retrieve all activities
  async findAll(): Promise<Activity[]> {
    return await this.activityRepository.find();
  }

  // Retrieve a single activity by ID
  async findOne(id: number): Promise<Activity> {
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
  ): Promise<Activity> {
    const activity = await this.findOne(id);
    Object.assign(activity, updateTicketActivityDto, { updatedAt: new Date() });
    return await this.activityRepository.save(activity);
  }

  // Remove an activity by ID
  async remove(id: number): Promise<void> {
    const activity = await this.findOne(id);
    await this.activityRepository.remove(activity);
  }
}
