import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateBlogPostDto } from './commands/create-blog-post/create-blog-post.dto';
import { CreateBlogPostCommand } from './commands/create-blog-post/create-blog-post.command';
import { CreateBlogPostHandler } from './commands/create-blog-post/create-blog-post.handler';
import { UpdateBlogPostDto } from './commands/update-blog-post/update-blog-post.dto';
import { UpdateBlogPostCommand } from './commands/update-blog-post/update-blog-post.command';
import { UpdateBlogPostHandler } from './commands/update-blog-post/update-blog-post.handler';
import { DeleteBlogPostCommand } from './commands/delete-blog-post/delete-blog-post.command';
import { DeleteBlogPostHandler } from './commands/delete-blog-post/delete-blog-post.handler';
import { GetBlogPostsQuery } from './queries/get-blog-posts/get-blog-posts.query';
import { GetBlogPostsHandler } from './queries/get-blog-posts/get-blog-posts.handler';
import { GetBlogPostQuery } from './queries/get-blog-post/get-blog-post.query';
import { GetBlogPostHandler } from './queries/get-blog-post/get-blog-post.handler';
import { GetBlogPostBySlugQuery } from './queries/get-blog-post-by-slug/get-blog-post-by-slug.query';
import { GetBlogPostBySlugHandler } from './queries/get-blog-post-by-slug/get-blog-post-by-slug.handler';
import { BlogPost } from './domain/blog-post.entity';
import { PaginatedBlogPosts } from './queries/get-blog-posts/get-blog-posts.handler';
import { CdnService } from './services/cdn.service';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(
    private readonly createBlogPostHandler: CreateBlogPostHandler,
    private readonly updateBlogPostHandler: UpdateBlogPostHandler,
    private readonly deleteBlogPostHandler: DeleteBlogPostHandler,
    private readonly getBlogPostsHandler: GetBlogPostsHandler,
    private readonly getBlogPostHandler: GetBlogPostHandler,
    private readonly getBlogPostBySlugHandler: GetBlogPostBySlugHandler,
    private readonly cdnService: CdnService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({
    status: 201,
    description: 'Blog post created successfully',
    type: BlogPost,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createBlogPost(@Body() dto: CreateBlogPostDto): Promise<BlogPost> {
    const command = new CreateBlogPostCommand(
      dto.title,
      dto.excerpt,
      dto.content,
      dto.authorName,
      dto.featuredImage,
      dto.featuredImageAlt,
      dto.tags,
      dto.categories,
      dto.status,
      dto.authorEmail,
      dto.authorAvatar,
      dto.isFeatured,
      dto.seoTitle,
      dto.seoDescription,
      dto.seoKeywords,
    );
    return this.createBlogPostHandler.handle(command);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts with filters' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'isFeatured',
    required: false,
    description: 'Filter featured posts',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search term' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated blog posts returned successfully',
  })
  async getBlogPosts(
    @Query('status') status?: string,
    @Query('tag') tag?: string,
    @Query('category') category?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedBlogPosts> {
    const query = new GetBlogPostsQuery(
      status,
      tag,
      category,
      isFeatured === 'true',
      search,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
    return this.getBlogPostsHandler.handle(query);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  @ApiParam({ name: 'slug', description: 'Blog post slug' })
  @ApiResponse({ status: 200, description: 'Blog post found', type: BlogPost })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async getBlogPostBySlug(@Param('slug') slug: string): Promise<BlogPost> {
    const query = new GetBlogPostBySlugQuery(slug);
    return this.getBlogPostBySlugHandler.handle(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog post by ID' })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({ status: 200, description: 'Blog post found', type: BlogPost })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async getBlogPost(@Param('id') id: string): Promise<BlogPost> {
    const query = new GetBlogPostQuery(id);
    return this.getBlogPostHandler.handle(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update blog post' })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog post updated successfully',
    type: BlogPost,
  })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateBlogPost(
    @Param('id') id: string,
    @Body() dto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    const command = new UpdateBlogPostCommand(
      id,
      dto.title,
      dto.excerpt,
      dto.content,
      dto.featuredImage,
      dto.featuredImageAlt,
      dto.tags,
      dto.categories,
      dto.status,
      dto.authorName,
      dto.authorEmail,
      dto.authorAvatar,
      dto.isFeatured,
      dto.seoTitle,
      dto.seoDescription,
      dto.seoKeywords,
    );
    return this.updateBlogPostHandler.handle(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete blog post' })
  @ApiParam({ name: 'id', description: 'Blog post ID' })
  @ApiResponse({ status: 204, description: 'Blog post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async deleteBlogPost(@Param('id') id: string): Promise<void> {
    const command = new DeleteBlogPostCommand(id);
    return this.deleteBlogPostHandler.handle(command);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload image to ArvanCloud CDN' })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      properties: {
        url: { type: 'string' },
        publicId: { type: 'string' },
        format: { type: 'string' },
        size: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid file or upload failed' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.cdnService.uploadImage(file);
  }
}
