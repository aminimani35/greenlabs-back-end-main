import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogPost } from './domain/blog-post.entity';
import { BlogPostRepository } from './repositories/blog-post.repository';
import { CdnService } from './services/cdn.service';

// Commands
import { CreateBlogPostHandler } from './commands/create-blog-post/create-blog-post.handler';
import { UpdateBlogPostHandler } from './commands/update-blog-post/update-blog-post.handler';
import { DeleteBlogPostHandler } from './commands/delete-blog-post/delete-blog-post.handler';

// Queries
import { GetBlogPostsHandler } from './queries/get-blog-posts/get-blog-posts.handler';
import { GetBlogPostHandler } from './queries/get-blog-post/get-blog-post.handler';
import { GetBlogPostBySlugHandler } from './queries/get-blog-post-by-slug/get-blog-post-by-slug.handler';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  controllers: [BlogController],
  providers: [
    BlogPostRepository,
    CdnService,
    // Command Handlers
    CreateBlogPostHandler,
    UpdateBlogPostHandler,
    DeleteBlogPostHandler,
    // Query Handlers
    GetBlogPostsHandler,
    GetBlogPostHandler,
    GetBlogPostBySlugHandler,
  ],
  exports: [BlogPostRepository, CdnService],
})
export class BlogModule {}
