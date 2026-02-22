import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SupportTicket,
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from '../domain/support-ticket.entity';

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  customerId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class SupportTicketRepository {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly repository: Repository<SupportTicket>,
  ) {}

  async findAll(
    filters?: TicketFilters,
  ): Promise<{ data: SupportTicket[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.customer', 'customer');

    if (filters?.status) {
      queryBuilder.andWhere('ticket.status = :status', {
        status: filters.status,
      });
    }

    if (filters?.priority) {
      queryBuilder.andWhere('ticket.priority = :priority', {
        priority: filters.priority,
      });
    }

    if (filters?.category) {
      queryBuilder.andWhere('ticket.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.assignedTo) {
      queryBuilder.andWhere('ticket.assignedTo = :assignedTo', {
        assignedTo: filters.assignedTo,
      });
    }

    if (filters?.customerId) {
      queryBuilder.andWhere('ticket.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(ticket.subject LIKE :search OR ticket.ticketNumber LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    queryBuilder.orderBy('ticket.createdAt', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findById(id: string): Promise<SupportTicket | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['customer', 'comments'],
    });
  }

  async findByTicketNumber(
    ticketNumber: string,
  ): Promise<SupportTicket | null> {
    return this.repository.findOne({
      where: { ticketNumber },
      relations: ['customer', 'comments'],
    });
  }

  async create(ticket: Partial<SupportTicket>): Promise<SupportTicket> {
    const newTicket = this.repository.create(ticket);
    return this.repository.save(newTicket);
  }

  async update(
    id: string,
    ticket: Partial<SupportTicket>,
  ): Promise<SupportTicket> {
    await this.repository.update(id, ticket);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async generateTicketNumber(): Promise<string> {
    const count = await this.repository.count();
    const number = String(count + 1).padStart(6, '0');
    return `TKT-${number}`;
  }

  async getStatistics() {
    const total = await this.repository.count();
    const open = await this.repository.count({
      where: { status: TicketStatus.OPEN },
    });
    const inProgress = await this.repository.count({
      where: { status: TicketStatus.IN_PROGRESS },
    });
    const resolved = await this.repository.count({
      where: { status: TicketStatus.RESOLVED },
    });
    const closed = await this.repository.count({
      where: { status: TicketStatus.CLOSED },
    });
    const urgent = await this.repository.count({
      where: { priority: TicketPriority.URGENT },
    });
    const critical = await this.repository.count({
      where: { priority: TicketPriority.CRITICAL },
    });

    return { total, open, inProgress, resolved, closed, urgent, critical };
  }
}
