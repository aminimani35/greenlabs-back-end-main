# GreenLabs Enterprise Blog - Setup Guide

## 🚀 Overview
A production-ready blog system built with **NestJS**, **PostgreSQL**, **TypeORM**, and **ArvanCloud CDN** following vertical slice architecture and CQRS pattern.

## 📋 Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- ArvanCloud account for CDN

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Update `.env` file with your ArvanCloud credentials:
```bash
# ArvanCloud CDN Configuration
ARVAN_API_KEY=your_actual_arvan_api_key
ARVAN_CDN_DOMAIN=your-domain.cdn.arvancdn.ir

# Database (already configured for Docker)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=greenlabs
DB_PASSWORD=greenlabs_password
DB_DATABASE=greenlabs_blog
```

### 3. Start PostgreSQL with Docker Compose
```bash
docker-compose up -d
```

This will start:
- **PostgreSQL 15** on port `5432`
- **pgAdmin** on port `5050` (http://localhost:5050)
  - Email: `admin@greenlabs.com`
  - Password: `admin`

### 4. Run the Application
```bash
# Development with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the server is running, access the documentation at:

- **Swagger UI**: http://localhost:3000/api/docs
- **Scalar Documentation**: http://localhost:3000/api/reference

## 🌐 API Endpoints

### Blog Posts

#### Create Blog Post
```http
POST /blog
Content-Type: application/json

{
  "title": "My First Blog Post",
  "excerpt": "A short summary of the post",
  "content": "Full blog content goes here...",
  "tags": ["technology", "nodejs"],
  "categories": ["Development"],
  "authorName": "John Doe",
  "authorEmail": "john@greenlabs.com",
  "isFeatured": true,
  "seoTitle": "My First Blog Post - GreenLabs",
  "seoDescription": "Learn about...",
  "seoKeywords": ["blog", "greenlabs"]
}
```

#### Get All Blog Posts (with filters)
```http
GET /blog?status=PUBLISHED&page=1&limit=10&search=nodejs&tag=technology
```

Query Parameters:
- `status`: DRAFT | PUBLISHED | ARCHIVED
- `tag`: Filter by tag
- `category`: Filter by category
- `isFeatured`: true | false
- `search`: Search in title/excerpt/content
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Get Blog Post by ID
```http
GET /blog/:id
```

#### Get Blog Post by Slug
```http
GET /blog/slug/:slug
```

#### Update Blog Post
```http
PUT /blog/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "PUBLISHED"
}
```

#### Delete Blog Post
```http
DELETE /blog/:id
```

#### Upload Image to ArvanCloud CDN
```http
POST /blog/upload-image
Content-Type: multipart/form-data

file: <image file>
```

Response:
```json
{
  "url": "https://your-domain.cdn.arvancdn.ir/greenlabs/blog/image.jpg",
  "publicId": "unique-file-id",
  "format": "jpg",
  "size": 123456
}
```

## 🗄️ Database Schema

### BlogPost Entity
- `id` (UUID, Primary Key)
- `title` (string, max 255)
- `slug` (string, unique, auto-generated)
- `excerpt` (text)
- `content` (text)
- `featuredImage` (string, CDN URL)
- `featuredImageAlt` (string)
- `tags` (string array)
- `categories` (string array)
- `status` (DRAFT | PUBLISHED | ARCHIVED)
- `authorName` (string)
- `authorEmail` (string)
- `authorAvatar` (string, CDN URL)
- `isFeatured` (boolean)
- `readingTime` (number, auto-calculated)
- `viewCount` (number)
- `likeCount` (number)
- `commentCount` (number)
- `seoTitle` (string)
- `seoDescription` (string)
- `seoKeywords` (string array)
- `publishedAt` (timestamp)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 🏗️ Architecture

### Vertical Slice Architecture
```
src/features/blog/
├── domain/
│   └── blog-post.entity.ts        # TypeORM entity
├── commands/
│   ├── create-blog-post/
│   │   ├── create-blog-post.dto.ts
│   │   ├── create-blog-post.command.ts
│   │   └── create-blog-post.handler.ts
│   ├── update-blog-post/
│   └── delete-blog-post/
├── queries/
│   ├── get-blog-posts/
│   ├── get-blog-post/
│   └── get-blog-post-by-slug/
├── repositories/
│   └── blog-post.repository.ts    # Data access layer
├── services/
│   └── cdn.service.ts              # ArvanCloud integration
├── blog.controller.ts
└── blog.module.ts
```

### CQRS Pattern
- **Commands**: Modify data (Create, Update, Delete)
- **Queries**: Read data (Get, List, Search)

## 🌩️ ArvanCloud CDN Setup

1. **Create an Account**: https://arvancloud.ir
2. **Get API Key**:
   - Go to CDN section
   - Navigate to API Keys
   - Create a new API key
3. **Configure Domain**:
   - Set up your CDN domain
   - Update `.env` with your domain

### CDN Service Features
- Automatic image upload
- File deletion
- Optimized URL generation
- Support for width/height parameters

## 🗃️ Database Management

### Access pgAdmin
1. Open http://localhost:5050
2. Login with `admin@greenlabs.com` / `admin`
3. Add server:
   - Host: `postgres` (Docker network) or `localhost`
   - Port: `5432`
   - Username: `greenlabs`
   - Password: `greenlabs_password`

### TypeORM Synchronization
In development mode, TypeORM automatically creates/updates database tables based on entities.

⚠️ **Production**: Set `synchronize: false` in `app.module.ts` and use migrations.

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f postgres

# Restart services
docker-compose restart
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **API Keys**: Rotate ArvanCloud API keys regularly
3. **Database**: Use strong passwords in production
4. **Input Validation**: All DTOs use class-validator
5. **File Upload**: Implement file size and type restrictions

## 🚀 Production Deployment

1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Disable TypeORM synchronize
4. Use process managers (PM2, systemd)
5. Set up reverse proxy (nginx)
6. Enable HTTPS
7. Configure CORS properly

## 📈 Performance Optimization

- **Database Indexing**: Slug, status, tags, categories
- **CDN**: All images served from ArvanCloud
- **Caching**: Implement Redis for frequently accessed posts
- **Pagination**: Built-in pagination for list endpoints
- **View Count**: Incremented asynchronously

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres
```

### Port Already in Use
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process (Windows)
taskkill /F /PID <process_id>
```

### ArvanCloud Upload Fails
- Verify API key is correct
- Check CDN domain configuration
- Ensure file is valid image format

## 📝 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [ArvanCloud CDN Docs](https://www.arvancloud.ir/en/docs/cdn)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Support

For issues or questions, contact the GreenLabs development team.

---

**Built with ❤️ by GreenLabs Team**
