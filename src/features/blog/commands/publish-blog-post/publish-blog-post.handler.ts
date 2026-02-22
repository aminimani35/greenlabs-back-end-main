import { Injectable, NotFoundException } from '@nestjs/common';
import { PublishBlogPostCommand } from './publish-blog-post.command';
import { BlogPostRepository } from '../../repositories/blog-post.repository';
import { BlogPost, BlogStatus } from '../../domain/blog-post.entity';

@Injectable()
export class PublishBlogPostHandler {
  constructor(private readonly blogPostRepository: BlogPostRepository) {}

  async handle(command: PublishBlogPostCommand): Promise<BlogPost> {
    const existingBlogPost = await this.blogPostRepository.findById(command.id);

    if (!existingBlogPost) {
      throw new NotFoundException(`Blog post with ID ${command.id} not found`);
    }

    existingBlogPost.status = BlogStatus.PUBLISHED;
    existingBlogPost.publishedAt = new Date();

    return this.blogPostRepository.update(command.id, existingBlogPost);
  }
}
