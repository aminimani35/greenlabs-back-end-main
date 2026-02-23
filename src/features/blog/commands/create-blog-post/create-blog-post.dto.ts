import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  IsEnum,
  MinLength,
  MaxLength,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { BlogStatus } from '../../domain/blog-post.entity';

export class CreateBlogPostDto {
  @ApiProperty({
    description: 'Blog post title',
    example: 'Getting Started with Vertical Slice Architecture',
    minLength: 3,
    maxLength: 255,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @ApiProperty({
    description: 'Short excerpt or summary',
    example:
      'Learn how to build scalable applications using vertical slice architecture...',
    minLength: 10,
    maxLength: 500,
  })
  @IsString({ message: 'Excerpt must be a string' })
  @IsNotEmpty({ message: 'Excerpt is required' })
  @MinLength(10, { message: 'Excerpt must be at least 10 characters long' })
  @MaxLength(500, { message: 'Excerpt must not exceed 500 characters' })
  excerpt: string;

  @ApiProperty({
    description: 'Full blog post content (supports Markdown)',
    example: '# Introduction\n\nThis is the full content of the blog post...',
  })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiPropertyOptional({
    description: 'Featured image URL from CDN',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
  })
  @IsUrl({}, { message: 'Featured image must be a valid URL' })
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({
    description: 'Alt text for featured image',
    example: 'Diagram showing vertical slice architecture',
  })
  @IsString({ message: 'Featured image alt text must be a string' })
  @IsOptional()
  featuredImageAlt?: string;

  @ApiPropertyOptional({
    description: 'Array of tags',
    example: ['architecture', 'nestjs', 'typescript'],
    type: [String],
  })
  @IsArray({ message: 'Tags must be an array' })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Array of categories',
    example: ['Engineering', 'Best Practices'],
    type: [String],
  })
  @IsArray({ message: 'Categories must be an array' })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Blog post status',
    enum: BlogStatus,
    example: BlogStatus.DRAFT,
  })
  @IsEnum(BlogStatus, {
    message: 'Status must be either draft, published, or archived',
  })
  @IsOptional()
  status?: BlogStatus;

  @ApiProperty({
    description: 'Author name',
    example: 'John Doe',
  })
  @IsString({ message: 'Author name must be a string' })
  @IsNotEmpty({ message: 'Author name is required' })
  authorName: string;

  @ApiPropertyOptional({
    description: 'Author email',
    example: 'john.doe@greenlabs.com',
  })
  @IsEmail({}, { message: 'Author email must be a valid email address' })
  @IsOptional()
  authorEmail?: string;

  @ApiPropertyOptional({
    description: 'Author avatar URL from CDN',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/avatar.jpg',
  })
  @IsUrl({}, { message: 'Author avatar must be a valid URL' })
  @IsOptional()
  authorAvatar?: string;

  @ApiPropertyOptional({
    description: 'Mark as featured post',
    example: false,
  })
  @IsBoolean({ message: 'isFeatured must be a boolean value' })
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'SEO optimized title',
    example: 'Vertical Slice Architecture Guide | GreenLabs Blog',
  })
  @IsString({ message: 'SEO title must be a string' })
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example:
      'Complete guide to implementing vertical slice architecture in your NestJS applications',
  })
  @IsString({ message: 'SEO description must be a string' })
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({
    description: 'SEO keywords',
    example: ['vertical slice', 'architecture', 'nestjs', 'cqrs'],
    type: [String],
  })
  @IsArray({ message: 'SEO keywords must be an array' })
  @IsOptional()
  seoKeywords?: string[];
}
