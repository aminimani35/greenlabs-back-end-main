import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BlogCategoryRepository } from '../repositories/blog-category.repository';
import { BlogCategory } from '../domain/blog-category.entity';
import {
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
  CategoryQueryDto,
} from '../dto/category-tag.dto';

@Injectable()
export class BlogCategoryService {
  constructor(private readonly categoryRepository: BlogCategoryRepository) {}

  async create(dto: CreateBlogCategoryDto): Promise<BlogCategory> {
    // Check if slug already exists
    const existing = await this.categoryRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(
        `Category with slug "${dto.slug}" already exists`,
      );
    }

    const category = this.categoryRepository.create({
      ...dto,
      postCount: 0,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      displayOrder: dto.displayOrder !== undefined ? dto.displayOrder : 0,
    });

    return this.categoryRepository.save(category);
  }

  async findAll(query: CategoryQueryDto): Promise<{
    categories: BlogCategory[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { categories, total } =
      await this.categoryRepository.findAllWithFilters(query);

    const limit = query.limit || 50;
    const page = query.page || 1;

    return {
      categories,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<BlogCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async findBySlug(slug: string): Promise<BlogCategory> {
    const category = await this.categoryRepository.findBySlug(slug);

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  async update(id: string, dto: UpdateBlogCategoryDto): Promise<BlogCategory> {
    const category = await this.findOne(id);

    // Check if new slug conflicts with existing
    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepository.findBySlug(dto.slug);
      if (existing) {
        throw new ConflictException(
          `Category with slug "${dto.slug}" already exists`,
        );
      }
    }

    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async getTopCategories(limit: number = 10): Promise<BlogCategory[]> {
    return this.categoryRepository.getTopCategories(limit);
  }

  async findByIds(ids: string[]): Promise<BlogCategory[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    return this.categoryRepository.findByIds(ids);
  }
}
