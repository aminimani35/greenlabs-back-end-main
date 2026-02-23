import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlogCategory } from '../domain/blog-category.entity';

export interface CategoryFilters {
  isActive?: boolean;
  parentId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class BlogCategoryRepository extends Repository<BlogCategory> {
  constructor(private dataSource: DataSource) {
    super(BlogCategory, dataSource.createEntityManager());
  }

  async findAllWithFilters(
    filters: CategoryFilters = {},
  ): Promise<{ categories: BlogCategory[]; total: number }> {
    const { isActive, parentId, search, page = 1, limit = 50 } = filters;

    const query = this.createQueryBuilder('category').orderBy(
      'category.displayOrder',
      'ASC',
    );

    if (isActive !== undefined) {
      query.andWhere('category.isActive = :isActive', { isActive });
    }

    if (parentId !== undefined) {
      if (parentId === null || parentId === 'null') {
        query.andWhere('category.parentId IS NULL');
      } else {
        query.andWhere('category.parentId = :parentId', { parentId });
      }
    }

    if (search) {
      query.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await query.getCount();
    const categories = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { categories, total };
  }

  async findBySlug(slug: string): Promise<BlogCategory | null> {
    return this.findOne({ where: { slug } });
  }

  async incrementPostCount(id: string): Promise<void> {
    await this.increment({ id }, 'postCount', 1);
  }

  async decrementPostCount(id: string): Promise<void> {
    await this.decrement({ id }, 'postCount', 1);
  }

  async getTopCategories(limit: number = 10): Promise<BlogCategory[]> {
    return this.find({
      where: { isActive: true },
      order: { postCount: 'DESC' },
      take: limit,
    });
  }
}
