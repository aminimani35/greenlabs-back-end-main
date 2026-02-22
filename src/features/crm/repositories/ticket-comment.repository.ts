import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketComment } from '../domain/ticket-comment.entity';

@Injectable()
export class TicketCommentRepository {
  constructor(
    @InjectRepository(TicketComment)
    private readonly repository: Repository<TicketComment>,
  ) {}

  async findByTicketId(ticketId: string): Promise<TicketComment[]> {
    return this.repository.find({
      where: { ticketId },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<TicketComment | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(comment: Partial<TicketComment>): Promise<TicketComment> {
    const newComment = this.repository.create(comment);
    return this.repository.save(newComment);
  }

  async update(
    id: string,
    comment: Partial<TicketComment>,
  ): Promise<TicketComment> {
    await this.repository.update(id, comment);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
