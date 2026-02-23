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
import { BlogTagService } from '../services/blog-tag.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import {
  CreateBlogTagDto,
  UpdateBlogTagDto,
  TagQueryDto,
} from '../dto/category-tag.dto';

@ApiTags('Blog')
@ApiBearerAuth('JWT-auth')
@Controller('api/blog/tags')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class BlogTagController {
  constructor(private readonly tagService: BlogTagService) {}

  @Post()
  @Roles('admin', 'editor')
  @RequirePermissions('blog:create')
  @ApiOperation({ summary: 'Create a new blog tag' })
  @ApiResponse({ status: 201, description: 'Tag created successfully' })
  async create(@Body() dto: CreateBlogTagDto) {
    return this.tagService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all blog tags' })
  @ApiResponse({ status: 200, description: 'Returns all tags' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiQuery({ name: 'isActive', required: false, example: true })
  @ApiQuery({ name: 'search', required: false })
  async findAll(@Query() query: TagQueryDto) {
    return this.tagService.findAll(query);
  }

  @Get('popular')
  @Public()
  @ApiOperation({ summary: 'Get popular tags by post count' })
  @ApiResponse({ status: 200, description: 'Returns popular tags' })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getPopularTags(@Query('limit') limit?: number) {
    return this.tagService.getPopularTags(limit || 20);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiResponse({ status: 200, description: 'Returns tag' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get a tag by slug' })
  @ApiResponse({ status: 200, description: 'Returns tag' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.tagService.findBySlug(slug);
  }

  @Put(':id')
  @Roles('admin', 'editor')
  @RequirePermissions('blog:update')
  @ApiOperation({ summary: 'Update a blog tag' })
  @ApiResponse({ status: 200, description: 'Tag updated successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateBlogTagDto) {
    return this.tagService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @RequirePermissions('blog:delete')
  @ApiOperation({ summary: 'Delete a blog tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async remove(@Param('id') id: string) {
    await this.tagService.remove(id);
    return { message: 'Tag deleted successfully' };
  }
}
