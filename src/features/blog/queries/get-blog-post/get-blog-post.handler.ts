import { Injectable, NotFoundException } from '@nestjs/common';
import { GetBlogPostQuery } from './get-blog-post.query';
import { BlogPost } from '../../domain/blog-post.entity';
import { BlogPostRepository } from '../../repositories/blog-post.repository';

@Injectable()
export class GetBlogPostHandler {
  constructor(private readonly blogPostRepository: BlogPostRepository) {}

  async handle(query: GetBlogPostQuery): Promise<BlogPost> {
    const post = await this.blogPostRepository.findById(query.id);

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${query.id} not found`);
    }

    // Increment view count
    await this.blogPostRepository.incrementViewCount(query.id);

    return post;
  }
}
