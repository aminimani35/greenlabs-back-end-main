import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
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

export class UpdateBlogPostDto {
  @ApiPropertyOptional({ description: 'Blog post title' })
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title?: string;

  @ApiPropertyOptional({ description: 'Short excerpt or summary' })
  @IsString({ message: 'Excerpt must be a string' })
  @IsOptional()
  @MinLength(10, { message: 'Excerpt must be at least 10 characters long' })
  @MaxLength(500, { message: 'Excerpt must not exceed 500 characters' })
  excerpt?: string;

  @ApiPropertyOptional({ description: 'Full blog post content' })
  @IsString({ message: 'Content must be a string' })
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Featured image URL from CDN' })
  @IsUrl({}, { message: 'Featured image must be a valid URL' })
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'Alt text for featured image' })
  @IsString({ message: 'Featured image alt text must be a string' })
  @IsOptional()
  featuredImageAlt?: string;

  @ApiPropertyOptional({ description: 'Array of tags', type: [String] })
  @IsArray({ message: 'Tags must be an array' })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Array of categories', type: [String] })
  @IsArray({ message: 'Categories must be an array' })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({ description: 'Blog post status', enum: BlogStatus })
  @IsEnum(BlogStatus, {
    message: 'Status must be either draft, published, or archived',
  })
  @IsOptional()
  status?: BlogStatus;

  @ApiPropertyOptional({ description: 'Author name' })
  @IsString({ message: 'Author name must be a string' })
  @IsOptional()
  authorName?: string;

  @ApiPropertyOptional({ description: 'Author email' })
  @IsEmail({}, { message: 'Author email must be a valid email address' })
  @IsOptional()
  authorEmail?: string;

  @ApiPropertyOptional({ description: 'Author avatar URL from CDN' })
  @IsUrl({}, { message: 'Author avatar must be a valid URL' })
  @IsOptional()
  authorAvatar?: string;

  @ApiPropertyOptional({ description: 'Mark as featured post' })
  @IsBoolean({ message: 'isFeatured must be a boolean value' })
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'SEO optimized title' })
  @IsString({ message: 'SEO title must be a string' })
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO meta description' })
  @IsString({ message: 'SEO description must be a string' })
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'SEO keywords', type: [String] })
  @IsArray({ message: 'SEO keywords must be an array' })
  @IsOptional()
  seoKeywords?: string[];
}
