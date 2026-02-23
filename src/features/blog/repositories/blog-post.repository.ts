import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost, BlogStatus } from '../domain/blog-post.entity';

@Injectable()
export class BlogPostRepository {
  constructor(
    @InjectRepository(BlogPost)
    private readonly repository: Repository<BlogPost>,
  ) {}

  async create(blogPostData: Partial<BlogPost>): Promise<BlogPost> {
    const blogPost = this.repository.create(blogPostData);
    return await this.repository.save(blogPost);
  }

  async findAll(options?: {
    status?: BlogStatus;
    tag?: string;
    category?: string;
    isFeatured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<[BlogPost[], number]> {
    const query = this.repository.createQueryBuilder('post');

    if (options?.status) {
      query.andWhere('post.status = :status', { status: options.status });
    }

    if (options?.tag) {
      query.andWhere(':tag = ANY(post.tags)', { tag: options.tag });
    }

    if (options?.category) {
      query.andWhere(':category = ANY(post.categories)', {
        category: options.category,
      });
    }

    if (options?.isFeatured !== undefined) {
      query.andWhere('post.isFeatured = :isFeatured', {
        isFeatured: options.isFeatured,
      });
    }

    if (options?.search) {
      query.andWhere(
        '(post.title ILIKE :search OR post.excerpt ILIKE :search OR post.content ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }

    query.orderBy('post.publishedAt', 'DESC');

    if (options?.limit) {
      query.take(options.limit);
    }

    if (options?.offset) {
      query.skip(options.offset);
    }

    return await query.getManyAndCount();
  }

  async findById(id: string): Promise<BlogPost | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    return await this.repository.findOne({ where: { slug } });
  }

  async update(
    id: string,
    blogPostData: Partial<BlogPost>,
  ): Promise<BlogPost | null> {
    await this.repository.update(id, blogPostData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.repository.increment({ id }, 'viewCount', 1);
  }

  async incrementLikeCount(id: string): Promise<void> {
    await this.repository.increment({ id }, 'likeCount', 1);
  }

  async getAllTags(): Promise<string[]> {
    const posts = await this.repository.find({
      relations: ['tags'],
      where: { status: BlogStatus.PUBLISHED },
    });
    const allTags = posts.flatMap(
      (post) => post.tags?.map((tag) => tag.name) || [],
    );
    return [...new Set(allTags)].sort();
  }

  async getAllCategories(): Promise<string[]> {
    const posts = await this.repository.find({
      relations: ['categories'],
      where: { status: BlogStatus.PUBLISHED },
    });
    const allCategories = posts.flatMap(
      (post) => post.categories?.map((cat) => cat.name) || [],
    );
    return [...new Set(allCategories)].sort();
  }
}
