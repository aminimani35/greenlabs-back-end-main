import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BlogTagRepository } from '../repositories/blog-tag.repository';
import { BlogTag } from '../domain/blog-tag.entity';
import {
  CreateBlogTagDto,
  UpdateBlogTagDto,
  TagQueryDto,
} from '../dto/category-tag.dto';

@Injectable()
export class BlogTagService {
  constructor(private readonly tagRepository: BlogTagRepository) {}

  async create(dto: CreateBlogTagDto): Promise<BlogTag> {
    // Check if slug already exists
    const existing = await this.tagRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(`Tag with slug "${dto.slug}" already exists`);
    }

    const tag = this.tagRepository.create({
      ...dto,
      postCount: 0,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    });

    return this.tagRepository.save(tag);
  }

  async findAll(query: TagQueryDto): Promise<{
    tags: BlogTag[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { tags, total } = await this.tagRepository.findAllWithFilters(query);

    const limit = query.limit || 50;
    const page = query.page || 1;

    return {
      tags,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<BlogTag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }

    return tag;
  }

  async findBySlug(slug: string): Promise<BlogTag> {
    const tag = await this.tagRepository.findBySlug(slug);

    if (!tag) {
      throw new NotFoundException(`Tag with slug "${slug}" not found`);
    }

    return tag;
  }

  async update(id: string, dto: UpdateBlogTagDto): Promise<BlogTag> {
    const tag = await this.findOne(id);

    // Check if new slug conflicts with existing
    if (dto.slug && dto.slug !== tag.slug) {
      const existing = await this.tagRepository.findBySlug(dto.slug);
      if (existing) {
        throw new ConflictException(
          `Tag with slug "${dto.slug}" already exists`,
        );
      }
    }

    Object.assign(tag, dto);
    return this.tagRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }

  async getPopularTags(limit: number = 20): Promise<BlogTag[]> {
    return this.tagRepository.getPopularTags(limit);
  }

  async findByIds(ids: string[]): Promise<BlogTag[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    return this.tagRepository.findByIds(ids);
  }
}
