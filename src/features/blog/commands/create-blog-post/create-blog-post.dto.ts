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
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Short excerpt or summary',
    example:
      'Learn how to build scalable applications using vertical slice architecture...',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  excerpt: string;

  @ApiProperty({
    description: 'Full blog post content (supports Markdown)',
    example: '# Introduction\n\nThis is the full content of the blog post...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Featured image URL from CDN',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
  })
  @IsUrl()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({
    description: 'Alt text for featured image',
    example: 'Diagram showing vertical slice architecture',
  })
  @IsString()
  @IsOptional()
  featuredImageAlt?: string;

  @ApiPropertyOptional({
    description: 'Array of tags',
    example: ['architecture', 'nestjs', 'typescript'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Array of categories',
    example: ['Engineering', 'Best Practices'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Blog post status',
    enum: BlogStatus,
    example: BlogStatus.DRAFT,
  })
  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;

  @ApiProperty({
    description: 'Author name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @ApiPropertyOptional({
    description: 'Author email',
    example: 'john.doe@greenlabs.com',
  })
  @IsEmail()
  @IsOptional()
  authorEmail?: string;

  @ApiPropertyOptional({
    description: 'Author avatar URL from CDN',
    example:
      'https://res.cloudinary.com/demo/image/upload/v1234567890/avatar.jpg',
  })
  @IsUrl()
  @IsOptional()
  authorAvatar?: string;

  @ApiPropertyOptional({
    description: 'Mark as featured post',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'SEO optimized title',
    example: 'Vertical Slice Architecture Guide | GreenLabs Blog',
  })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description',
    example:
      'Complete guide to implementing vertical slice architecture in your NestJS applications',
  })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({
    description: 'SEO keywords',
    example: ['vertical slice', 'architecture', 'nestjs', 'cqrs'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  seoKeywords?: string[];
}
