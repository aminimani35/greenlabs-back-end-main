import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../domain/role.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Role | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findByIds(ids: string[]): Promise<Role[]> {
    return this.repository.find({ where: { id: In(ids) } });
  }

  async create(role: Partial<Role>): Promise<Role> {
    const newRole = this.repository.create(role);
    return this.repository.save(newRole);
  }

  async update(id: string, role: Partial<Role>): Promise<Role> {
    await this.repository.update(id, role);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
