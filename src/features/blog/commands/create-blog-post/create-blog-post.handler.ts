import { Injectable } from '@nestjs/common';
import { CreateBlogPostCommand } from './create-blog-post.command';
import { BlogPost, BlogStatus } from '../../domain/blog-post.entity';
import { BlogPostRepository } from '../../repositories/blog-post.repository';
import { BlogCategoryService } from '../../services/blog-category.service';
import { BlogTagService } from '../../services/blog-tag.service';

@Injectable()
export class CreateBlogPostHandler {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly categoryService: BlogCategoryService,
    private readonly tagService: BlogTagService,
  ) {}

  async handle(command: CreateBlogPostCommand): Promise<BlogPost> {
    // Generate slug from title
    const slug = this.generateSlug(command.title);

    // Calculate reading time (average 200 words per minute)
    const wordCount = command.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Fetch categories and tags
    const categories = command.categoryIds
      ? await this.categoryService.findByIds(command.categoryIds)
      : [];
    const tags = command.tagIds
      ? await this.tagService.findByIds(command.tagIds)
      : [];

    const blogPost = await this.blogPostRepository.create({
      title: command.title,
      slug,
      excerpt: command.excerpt,
      content: command.content,
      featuredImage: command.featuredImage,
      featuredImageAlt: command.featuredImageAlt,
      tags,
      categories,
      status: command.status || BlogStatus.DRAFT,
      authorName: command.authorName,
      authorEmail: command.authorEmail,
      authorAvatar: command.authorAvatar,
      isFeatured: command.isFeatured || false,
      readingTime,
      seoTitle: command.seoTitle || command.title,
      seoDescription: command.seoDescription || command.excerpt,
      seoKeywords: command.seoKeywords || [],
      publishedAt: command.status === BlogStatus.PUBLISHED ? new Date() : null,
    });

    return blogPost;
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
