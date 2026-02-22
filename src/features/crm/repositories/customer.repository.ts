import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Customer,
  CustomerStatus,
  CustomerPriority,
} from '../domain/customer.entity';

export interface CustomerFilters {
  status?: CustomerStatus;
  priority?: CustomerPriority;
  search?: string;
  assignedTo?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {}

  async findAll(
    filters?: CustomerFilters,
  ): Promise<{ data: Customer[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('customer');

    if (filters?.status) {
      queryBuilder.andWhere('customer.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.priority) {
      queryBuilder.andWhere('customer.priority = :priority', {
        priority: filters.priority,
      });
    }

    if (filters?.assignedTo) {
      queryBuilder.andWhere('customer.assignedTo = :assignedTo', {
        assignedTo: filters.assignedTo,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(customer.name LIKE :search OR customer.email LIKE :search OR customer.company LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    queryBuilder.orderBy('customer.createdAt', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findById(id: string): Promise<Customer | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['tickets', 'customerNotes', 'activities'],
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(customer: Partial<Customer>): Promise<Customer> {
    const newCustomer = this.repository.create(customer);
    return this.repository.save(newCustomer);
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    await this.repository.update(id, customer);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getStatistics() {
    const total = await this.repository.count();
    const active = await this.repository.count({
      where: { status: CustomerStatus.ACTIVE },
    });
    const leads = await this.repository.count({
      where: { status: CustomerStatus.LEAD },
    });
    const prospects = await this.repository.count({
      where: { status: CustomerStatus.PROSPECT },
    });
    const vip = await this.repository.count({
      where: { priority: CustomerPriority.VIP },
    });

    return { total, active, leads, prospects, vip };
  }
}
