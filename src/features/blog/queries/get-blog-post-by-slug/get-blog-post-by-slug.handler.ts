import { Injectable, NotFoundException } from '@nestjs/common';
import { GetBlogPostBySlugQuery } from './get-blog-post-by-slug.query';
import { BlogPost } from '../../domain/blog-post.entity';
import { BlogPostRepository } from '../../repositories/blog-post.repository';

@Injectable()
export class GetBlogPostBySlugHandler {
  constructor(private readonly blogPostRepository: BlogPostRepository) {}

  async handle(query: GetBlogPostBySlugQuery): Promise<BlogPost> {
    const post = await this.blogPostRepository.findBySlug(query.slug);

    if (!post) {
      throw new NotFoundException(
        `Blog post with slug "${query.slug}" not found`,
      );
    }

    // Increment view count
    await this.blogPostRepository.incrementViewCount(post.id);

    return post;
  }
}
