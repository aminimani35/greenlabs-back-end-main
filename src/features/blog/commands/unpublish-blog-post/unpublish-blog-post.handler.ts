import { Injectable, NotFoundException } from '@nestjs/common';
import { UnpublishBlogPostCommand } from './unpublish-blog-post.command';
import { BlogPostRepository } from '../../repositories/blog-post.repository';
import { BlogPost, BlogStatus } from '../../domain/blog-post.entity';

@Injectable()
export class UnpublishBlogPostHandler {
  constructor(private readonly blogPostRepository: BlogPostRepository) {}

  async handle(command: UnpublishBlogPostCommand): Promise<BlogPost> {
    const existingBlogPost = await this.blogPostRepository.findById(command.id);

    if (!existingBlogPost) {
      throw new NotFoundException(`Blog post with ID ${command.id} not found`);
    }

    existingBlogPost.status = BlogStatus.DRAFT;

    return this.blogPostRepository.update(command.id, existingBlogPost);
  }
}
