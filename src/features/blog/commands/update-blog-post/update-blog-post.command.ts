import { BlogStatus } from '../../domain/blog-post.entity';

export class UpdateBlogPostCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly excerpt?: string,
    public readonly content?: string,
    public readonly featuredImage?: string,
    public readonly featuredImageAlt?: string,
    public readonly tagIds?: string[],
    public readonly categoryIds?: string[],
    public readonly status?: BlogStatus,
    public readonly authorName?: string,
    public readonly authorEmail?: string,
    public readonly authorAvatar?: string,
    public readonly isFeatured?: boolean,
    public readonly seoTitle?: string,
    public readonly seoDescription?: string,
    public readonly seoKeywords?: string[],
  ) {}
}
