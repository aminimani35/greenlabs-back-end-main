import { BlogStatus } from '../../domain/blog-post.entity';

export class CreateBlogPostCommand {
  constructor(
    public readonly title: string,
    public readonly excerpt: string,
    public readonly content: string,
    public readonly authorName: string,
    public readonly featuredImage?: string,
    public readonly featuredImageAlt?: string,
    public readonly tags?: string[],
    public readonly categories?: string[],
    public readonly status?: BlogStatus,
    public readonly authorEmail?: string,
    public readonly authorAvatar?: string,
    public readonly isFeatured?: boolean,
    public readonly seoTitle?: string,
    public readonly seoDescription?: string,
    public readonly seoKeywords?: string[],
  ) {}
}
