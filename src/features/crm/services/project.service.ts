import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../domain/project.entity';
import { Customer } from '../domain/customer.entity';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';
import * as crypto from 'crypto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createProject(dto: CreateProjectDto): Promise<Project> {
    // Verify customer exists
    const customer = await this.customerRepository.findOne({
      where: { id: dto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Generate unique project code
    const projectCode = this.generateProjectCode(customer.name);

    const project = this.projectRepository.create({
      ...dto,
      projectCode,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      teamMembers: dto.teamMembers || [],
      metadata: dto.metadata || {},
    });

    return await this.projectRepository.save(project);
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async getAllProjects(filters?: {
    customerId?: string;
    status?: string;
  }): Promise<Project[]> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.customer', 'customer');

    if (filters?.customerId) {
      queryBuilder.andWhere('project.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }

    if (filters?.status) {
      queryBuilder.andWhere('project.status = :status', {
        status: filters.status,
      });
    }

    return await queryBuilder.orderBy('project.createdAt', 'DESC').getMany();
  }

  async updateProject(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const updateData: any = { ...dto };
    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate);
    }

    await this.projectRepository.update(id, updateData);

    return await this.projectRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
  }

  async deleteProject(id: string): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.delete(id);
  }

  async getProjectsByCustomer(customerId: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { customerId },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  private generateProjectCode(customerName: string): string {
    const prefix = customerName
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, 'X');
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
