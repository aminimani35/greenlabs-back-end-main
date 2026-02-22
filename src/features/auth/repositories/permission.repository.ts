import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permission } from '../domain/permission.entity';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Permission | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.repository.findOne({ where: { name } });
  }

  async findByIds(ids: string[]): Promise<Permission[]> {
    return this.repository.find({ where: { id: In(ids) } });
  }

  async create(permission: Partial<Permission>): Promise<Permission> {
    const newPermission = this.repository.create(permission);
    return this.repository.save(newPermission);
  }

  async update(
    id: string,
    permission: Partial<Permission>,
  ): Promise<Permission> {
    await this.repository.update(id, permission);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
