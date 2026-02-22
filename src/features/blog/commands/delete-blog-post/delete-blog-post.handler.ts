import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteBlogPostCommand } from './delete-blog-post.command';
import { BlogPostRepository } from '../../repositories/blog-post.repository';

@Injectable()
export class DeleteBlogPostHandler {
  constructor(private readonly blogPostRepository: BlogPostRepository) {}

  async handle(command: DeleteBlogPostCommand): Promise<void> {
    const deleted = await this.blogPostRepository.delete(command.id);

    if (!deleted) {
      throw new NotFoundException(`Blog post with ID ${command.id} not found`);
    }
  }
}
