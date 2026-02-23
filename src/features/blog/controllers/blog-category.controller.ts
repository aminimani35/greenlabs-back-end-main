import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BlogCategoryService } from '../services/blog-category.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import {
  CreateBlogCategoryDto,
  UpdateBlogCategoryDto,
  CategoryQueryDto,
} from '../dto/category-tag.dto';

@ApiTags('Blog')
@ApiBearerAuth('JWT-auth')
@Controller('api/blog/categories')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class BlogCategoryController {
  constructor(private readonly categoryService: BlogCategoryService) {}

  @Post()
  @Roles('admin', 'editor')
  @RequirePermissions('blog:create')
  @ApiOperation({ summary: 'Create a new blog category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async create(@Body() dto: CreateBlogCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all blog categories' })
  @ApiResponse({ status: 200, description: 'Returns all categories' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiQuery({ name: 'isActive', required: false, example: true })
  @ApiQuery({ name: 'parentId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(@Query() query: CategoryQueryDto) {
    return this.categoryService.findAll(query);
  }

  @Get('top')
  @Public()
  @ApiOperation({ summary: 'Get top categories by post count' })
  @ApiResponse({ status: 200, description: 'Returns top categories' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getTopCategories(@Query('limit') limit?: number) {
    return this.categoryService.getTopCategories(limit || 10);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Returns category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get a category by slug' })
  @ApiResponse({ status: 200, description: 'Returns category' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Put(':id')
  @Roles('admin', 'editor')
  @RequirePermissions('blog:update')
  @ApiOperation({ summary: 'Update a blog category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateBlogCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @RequirePermissions('blog:delete')
  @ApiOperation({ summary: 'Delete a blog category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
    return { message: 'Category deleted successfully' };
  }
}
