import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBlogPostCommand } from './update-blog-post.command';
import { BlogPost, BlogStatus } from '../../domain/blog-post.entity';
import { BlogPostRepository } from '../../repositories/blog-post.repository';
import { BlogCategoryService } from '../../services/blog-category.service';
import { BlogTagService } from '../../services/blog-tag.service';

@Injectable()
export class UpdateBlogPostHandler {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly categoryService: BlogCategoryService,
    private readonly tagService: BlogTagService,
  ) {}

  async handle(command: UpdateBlogPostCommand): Promise<BlogPost> {
    const existingPost = await this.blogPostRepository.findById(command.id);

    if (!existingPost) {
      throw new NotFoundException(`Blog post with ID ${command.id} not found`);
    }

    const updateData: Partial<BlogPost> = {};

    if (command.title) {
      updateData.title = command.title;
      updateData.slug = this.generateSlug(command.title);
    }
    if (command.excerpt) updateData.excerpt = command.excerpt;
    if (command.content) {
      updateData.content = command.content;
      const wordCount = command.content.split(/\s+/).length;
      updateData.readingTime = Math.ceil(wordCount / 200);
    }
    if (command.featuredImage !== undefined)
      updateData.featuredImage = command.featuredImage;
    if (command.featuredImageAlt !== undefined)
      updateData.featuredImageAlt = command.featuredImageAlt;

    // Handle tags
    if (command.tagIds !== undefined) {
      updateData.tags =
        command.tagIds.length > 0
          ? await this.tagService.findByIds(command.tagIds)
          : [];
    }

    // Handle categories
    if (command.categoryIds !== undefined) {
      updateData.categories =
        command.categoryIds.length > 0
          ? await this.categoryService.findByIds(command.categoryIds)
          : [];
    }

    if (command.status) {
      updateData.status = command.status;
      if (
        command.status === BlogStatus.PUBLISHED &&
        !existingPost.publishedAt
      ) {
        updateData.publishedAt = new Date();
      }
    }
    if (command.authorName) updateData.authorName = command.authorName;
    if (command.authorEmail !== undefined)
      updateData.authorEmail = command.authorEmail;
    if (command.authorAvatar !== undefined)
      updateData.authorAvatar = command.authorAvatar;
    if (command.isFeatured !== undefined)
      updateData.isFeatured = command.isFeatured;
    if (command.seoTitle) updateData.seoTitle = command.seoTitle;
    if (command.seoDescription)
      updateData.seoDescription = command.seoDescription;
    if (command.seoKeywords) updateData.seoKeywords = command.seoKeywords;

    const updated = await this.blogPostRepository.update(
      command.id,
      updateData,
    );
    return updated!;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
