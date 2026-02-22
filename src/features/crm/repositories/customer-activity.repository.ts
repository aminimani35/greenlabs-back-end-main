import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CustomerActivity,
  ActivityType,
} from '../domain/customer-activity.entity';

@Injectable()
export class CustomerActivityRepository {
  constructor(
    @InjectRepository(CustomerActivity)
    private readonly repository: Repository<CustomerActivity>,
  ) {}

  async findByCustomerId(
    customerId: string,
    limit = 50,
  ): Promise<CustomerActivity[]> {
    return this.repository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async create(activity: Partial<CustomerActivity>): Promise<CustomerActivity> {
    const newActivity = this.repository.create(activity);
    return this.repository.save(newActivity);
  }

  async logActivity(
    customerId: string,
    type: ActivityType,
    description: string,
    performedBy?: string,
    performedByName?: string,
    metadata?: Record<string, any>,
  ): Promise<CustomerActivity> {
    return this.create({
      customerId,
      type,
      description,
      performedBy,
      performedByName,
      metadata,
    });
  }
}
