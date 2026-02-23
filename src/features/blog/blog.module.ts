import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogPost } from './domain/blog-post.entity';
import { BlogCategory } from './domain/blog-category.entity';
import { BlogTag } from './domain/blog-tag.entity';
import { BlogPostRepository } from './repositories/blog-post.repository';
import { BlogCategoryRepository } from './repositories/blog-category.repository';
import { BlogTagRepository } from './repositories/blog-tag.repository';
import { CdnService } from './services/cdn.service';
import { BlogCategoryService } from './services/blog-category.service';
import { BlogTagService } from './services/blog-tag.service';
import { BlogCategoryController } from './controllers/blog-category.controller';
import { BlogTagController } from './controllers/blog-tag.controller';

// Commands
import { CreateBlogPostHandler } from './commands/create-blog-post/create-blog-post.handler';
import { UpdateBlogPostHandler } from './commands/update-blog-post/update-blog-post.handler';
import { DeleteBlogPostHandler } from './commands/delete-blog-post/delete-blog-post.handler';
import { PublishBlogPostHandler } from './commands/publish-blog-post/publish-blog-post.handler';
import { UnpublishBlogPostHandler } from './commands/unpublish-blog-post/unpublish-blog-post.handler';

// Queries
import { GetBlogPostsHandler } from './queries/get-blog-posts/get-blog-posts.handler';
import { GetBlogPostHandler } from './queries/get-blog-post/get-blog-post.handler';
import { GetBlogPostBySlugHandler } from './queries/get-blog-post-by-slug/get-blog-post-by-slug.handler';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost, BlogCategory, BlogTag])],
  controllers: [BlogController, BlogCategoryController, BlogTagController],
  providers: [
    BlogPostRepository,
    BlogCategoryRepository,
    BlogTagRepository,
    CdnService,
    BlogCategoryService,
    BlogTagService,
    // Command Handlers
    CreateBlogPostHandler,
    UpdateBlogPostHandler,
    DeleteBlogPostHandler,
    PublishBlogPostHandler,
    UnpublishBlogPostHandler,
    // Query Handlers
    GetBlogPostsHandler,
    GetBlogPostHandler,
    GetBlogPostBySlugHandler,
  ],
  exports: [
    BlogPostRepository,
    CdnService,
    BlogCategoryService,
    BlogTagService,
  ],
})
export class BlogModule {}
