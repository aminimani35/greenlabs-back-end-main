import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BlogTag } from '../domain/blog-tag.entity';

export interface TagFilters {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class BlogTagRepository extends Repository<BlogTag> {
  constructor(private dataSource: DataSource) {
    super(BlogTag, dataSource.createEntityManager());
  }

  async findAllWithFilters(
    filters: TagFilters = {},
  ): Promise<{ tags: BlogTag[]; total: number }> {
    const { isActive, search, page = 1, limit = 50 } = filters;

    const query = this.createQueryBuilder('tag').orderBy('tag.name', 'ASC');

    if (isActive !== undefined) {
      query.andWhere('tag.isActive = :isActive', { isActive });
    }

    if (search) {
      query.andWhere(
        '(tag.name ILIKE :search OR tag.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await query.getCount();
    const tags = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { tags, total };
  }

  async findBySlug(slug: string): Promise<BlogTag | null> {
    return this.findOne({ where: { slug } });
  }

  async findByNames(names: string[]): Promise<BlogTag[]> {
    return this.createQueryBuilder('tag')
      .where('tag.name IN (:...names)', { names })
      .getMany();
  }

  async incrementPostCount(id: string): Promise<void> {
    await this.increment({ id }, 'postCount', 1);
  }

  async decrementPostCount(id: string): Promise<void> {
    await this.decrement({ id }, 'postCount', 1);
  }

  async getPopularTags(limit: number = 20): Promise<BlogTag[]> {
    return this.find({
      where: { isActive: true },
      order: { postCount: 'DESC' },
      take: limit,
    });
  }
}
