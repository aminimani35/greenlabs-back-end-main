import { Injectable } from '@nestjs/common';
import { GetBlogPostsQuery } from './get-blog-posts.query';
import { BlogPost, BlogStatus } from '../../domain/blog-post.entity';
import { BlogPostRepository } from '../../repositories/blog-post.repository';

export interface PaginatedBlogPosts {
  data: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class GetBlogPostsHandler {
  constructor(private readonly blogPostRepository: BlogPostRepository) {}

  async handle(query: GetBlogPostsQuery): Promise<PaginatedBlogPosts> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const [posts, total] = await this.blogPostRepository.findAll({
      status: query.status as BlogStatus,
      tag: query.tag,
      category: query.category,
      isFeatured: query.isFeatured,
      search: query.search,
      limit,
      offset,
    });

    return {
      data: posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
