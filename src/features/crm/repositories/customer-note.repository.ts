import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerNote } from '../domain/customer-note.entity';

@Injectable()
export class CustomerNoteRepository {
  constructor(
    @InjectRepository(CustomerNote)
    private readonly repository: Repository<CustomerNote>,
  ) {}

  async findByCustomerId(customerId: string): Promise<CustomerNote[]> {
    return this.repository.find({
      where: { customerId },
      order: { isPinned: 'DESC', createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<CustomerNote | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(note: Partial<CustomerNote>): Promise<CustomerNote> {
    const newNote = this.repository.create(note);
    return this.repository.save(newNote);
  }

  async update(id: string, note: Partial<CustomerNote>): Promise<CustomerNote> {
    await this.repository.update(id, note);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
