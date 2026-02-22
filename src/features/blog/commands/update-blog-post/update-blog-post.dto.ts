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
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ description: 'Short excerpt or summary' })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional({ description: 'Full blog post content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Featured image URL from CDN' })
  @IsUrl()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'Alt text for featured image' })
  @IsString()
  @IsOptional()
  featuredImageAlt?: string;

  @ApiPropertyOptional({ description: 'Array of tags', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Array of categories', type: [String] })
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({ description: 'Blog post status', enum: BlogStatus })
  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;

  @ApiPropertyOptional({ description: 'Author name' })
  @IsString()
  @IsOptional()
  authorName?: string;

  @ApiPropertyOptional({ description: 'Author email' })
  @IsEmail()
  @IsOptional()
  authorEmail?: string;

  @ApiPropertyOptional({ description: 'Author avatar URL from CDN' })
  @IsUrl()
  @IsOptional()
  authorAvatar?: string;

  @ApiPropertyOptional({ description: 'Mark as featured post' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'SEO optimized title' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO meta description' })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'SEO keywords', type: [String] })
  @IsArray()
  @IsOptional()
  seoKeywords?: string[];
}
