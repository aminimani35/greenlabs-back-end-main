import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 500 })
  slug: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'featured_image', nullable: true })
  featuredImage: string;

  @Column({ name: 'featured_image_alt', nullable: true, length: 255 })
  featuredImageAlt: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'simple-array', nullable: true })
  categories: string[];

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  @Column({ name: 'author_id', nullable: true })
  authorId: string;

  @Column({ name: 'author_name', length: 255 })
  authorName: string;

  @Column({ name: 'author_email', length: 255, nullable: true })
  authorEmail: string;

  @Column({ name: 'author_avatar', nullable: true })
  authorAvatar: string;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'comment_count', default: 0 })
  commentCount: number;

  @Column({ name: 'reading_time', nullable: true })
  readingTime: number; // in minutes

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'published_at', nullable: true })
  publishedAt: Date;

  @Column({ type: 'text', nullable: true })
  seoTitle: string;

  @Column({ type: 'text', nullable: true })
  seoDescription: string;

  @Column({ type: 'simple-array', nullable: true })
  seoKeywords: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
