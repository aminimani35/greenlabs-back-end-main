import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  MaxLength,
  Min,
  Matches,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== Category DTOs ====================

export class CreateBlogCategoryDto {
  @ApiProperty({ example: 'Technology' })
  @IsString({ message: 'Category name must be a string' })
  @MaxLength(255, { message: 'Category name must not exceed 255 characters' })
  name: string;

  @ApiProperty({ example: 'technology' })
  @IsString({ message: 'Slug must be a string' })
  @MaxLength(500, { message: 'Slug must not exceed 500 characters' })
  slug: string;

  @ApiPropertyOptional({
    example: 'Articles about technology and innovation',
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '#3498db' })
  @IsString({ message: 'Color must be a string' })
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color code (e.g., #3498db)' })
  color?: string;

  @ApiPropertyOptional({ example: 'tech-icon' })
  @IsString({ message: 'Icon must be a string' })
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'parent-category-uuid' })
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt({ message: 'Display order must be an integer' })
  @Min(0, { message: 'Display order must be at least 0' })
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean;
}

export class UpdateBlogCategoryDto {
  @ApiPropertyOptional({ example: 'Technology' })
  @IsString({ message: 'Category name must be a string' })
  @MaxLength(255, { message: 'Category name must not exceed 255 characters' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'technology' })
  @IsString({ message: 'Slug must be a string' })
  @MaxLength(500, { message: 'Slug must not exceed 500 characters' })
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Articles about technology and innovation',
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '#3498db' })
  @IsString({ message: 'Color must be a string' })
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color code (e.g., #3498db)',
  })
  color?: string;

  @ApiPropertyOptional({ example: 'tech-icon' })
  @IsString({ message: 'Icon must be a string' })
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'parent-category-uuid' })
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt({ message: 'Display order must be an integer' })
  @Min(0, { message: 'Display order must be at least 0' })
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean;
}

export class CategoryQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 50 })
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @IsOptional()
  limit?: number = 50;

  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'parent-uuid or null for root categories' })
  @IsString({ message: 'Parent ID must be a string' })
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ example: 'tech' })
  @IsString({ message: 'Search must be a string' })
  @IsOptional()
  search?: string;
}

// ==================== Tag DTOs ====================

export class CreateBlogTagDto {
  @ApiProperty({ example: 'JavaScript' })
  @IsString({ message: 'Tag name must be a string' })
  @MaxLength(255, { message: 'Tag name must not exceed 255 characters' })
  name: string;

  @ApiProperty({ example: 'javascript' })
  @IsString({ message: 'Slug must be a string' })
  @MaxLength(500, { message: 'Slug must not exceed 500 characters' })
  slug: string;

  @ApiPropertyOptional({ example: 'All about JavaScript programming' })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '#f39c12' })
  @IsString({ message: 'Color must be a string' })
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color code (e.g., #f39c12)',
  })
  color?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean;
}

export class UpdateBlogTagDto {
  @ApiPropertyOptional({ example: 'JavaScript' })
  @IsString({ message: 'Tag name must be a string' })
  @MaxLength(255, { message: 'Tag name must not exceed 255 characters' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'javascript' })
  @IsString({ message: 'Slug must be a string' })
  @MaxLength(500, { message: 'Slug must not exceed 500 characters' })
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'All about JavaScript programming' })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '#f39c12' })
  @IsString({ message: 'Color must be a string' })
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color code (e.g., #f39c12)',
  })
  color?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean;
}

export class TagQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 50 })
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @IsOptional()
  limit?: number = 50;

  @ApiPropertyOptional({ example: true })
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'java' })
  @IsString({ message: 'Search must be a string' })
  @IsOptional()
  search?: string;
}
