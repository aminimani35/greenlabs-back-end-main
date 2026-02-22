# Enterprise Identity & RBAC System - Quick Start

## 🎉 What's Implemented

Your application now has a complete enterprise-level authentication and authorization system!

### ✅ Features Implemented

1. **JWT Authentication** - Secure token-based auth
2. **Role-Based Access Control (RBAC)** - Fine-grained permissions
3. **Password Security** - Bcrypt hashing
4. **Global Auth Guards** - Automatic route protection
5. **Decorators** - Easy-to-use auth decorators
6. **Auto-Seeding** - Automatic role/permission setup
7. **Swagger Integration** - Full API documentation with auth

## 🚀 Quick Start

### 1. Set Environment Variables

Copy `.env.example` to `.env` and set JWT_SECRET:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-at-least-32-chars
JWT_EXPIRES_IN=24h
```

### 2. Start the Application

The database will auto-create tables and seed default roles/permissions:

```bash
npm run start:dev
```

### 3. Test Authentication

#### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "name": "Admin User",
    "password": "SecurePass123!"
  }'
```

Response includes JWT token:

```json
{
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User",
    "roles": [...]
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!"
  }'
```

#### Access Protected Routes

```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Test with Swagger

1. Navigate to: `http://localhost:3000/api/docs`
2. Click **Authorize** button (top right)
3. Enter: `Bearer YOUR_TOKEN_HERE`
4. Click **Authorize**
5. Now you can test all protected endpoints!

## 🔒 Default Roles

### Admin

- **Full access** to all resources
- Permissions: All (blog, user, product - create, read, update, delete, publish)

### Editor

- **Content management** access
- Permissions: Blog & Product (create, read, update, publish)

### User

- **Read-only** access
- Permissions: Blog, Product, User (read only)

## 📝 Using Auth in Your Code

### Protect an Endpoint (Requires Authentication)

```typescript
@Get('protected')
async protectedRoute() {
  // Authentication required by default
  return 'Only authenticated users can access this';
}
```

### Public Endpoint (No Authentication)

```typescript
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Get('public')
async publicRoute() {
  return 'Anyone can access this';
}
```

### Require Specific Roles

```typescript
import { Roles } from '../auth/decorators/roles.decorator';

@Roles('admin', 'editor')
@Post('create')
async createResource() {
  return 'Only admins and editors';
}
```

### Require Specific Permissions

```typescript
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@RequirePermissions('blog:create')
@Post('blog')
async createBlog() {
  return 'Requires blog:create permission';
}
```

### Get Current User

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Get('me')
async getCurrentUser(@CurrentUser() user: any) {
  // user contains: { userId, email, roles, permissions }
  return user;
}
```

### Add Bearer Auth to Swagger Docs

```typescript
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Get('protected')
async protectedRoute() {
  return 'Protected';
}
```

## 🎯 Example: Blog Controller

The blog controller demonstrates the complete auth system:

- **Public routes**: GET endpoints (read blog posts)
- **Editor routes**: POST, PUT, PATCH (create/update posts)
- **Admin routes**: DELETE (delete posts)
- **Permission-based**: All write operations check specific permissions

Check [src/features/blog/blog.controller.ts](src/features/blog/blog.controller.ts) for examples!

## 📚 Full Documentation

See [AUTH_GUIDE.md](AUTH_GUIDE.md) for comprehensive documentation including:

- Architecture details
- All endpoints
- Security best practices
- Permission naming conventions
- Troubleshooting
- Extending the system

## 🔑 Important Security Notes

⚠️ **Before deploying to production:**

1. Change `JWT_SECRET` to a strong random value (at least 32 characters)
2. Use HTTPS only in production
3. Set appropriate CORS origins
4. Implement rate limiting
5. Enable database migrations (disable synchronize in production)
6. Set up proper logging and monitoring

## 🧪 Next Steps

1. **Test the endpoints** using Swagger or curl
2. **Create users** with different roles
3. **Customize permissions** for your use cases
4. **Add more roles** as needed
5. **Implement refresh tokens** (optional)
6. **Add email verification** (optional)

## 📁 New Files Created

```
src/features/auth/
├── auth.controller.ts
├── auth.module.ts
├── decorators/
│   ├── current-user.decorator.ts
│   ├── permissions.decorator.ts
│   ├── public.decorator.ts
│   └── roles.decorator.ts
├── domain/
│   ├── permission.entity.ts
│   └── role.entity.ts
├── dto/
│   ├── login.dto.ts
│   └── register.dto.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── permissions.guard.ts
│   └── roles.guard.ts
├── repositories/
│   ├── permission.repository.ts
│   └── role.repository.ts
├── services/
│   ├── auth.service.ts
│   └── auth-seeder.service.ts
└── strategies/
    └── jwt.strategy.ts
```

## 🎊 You're All Set!

Your application now has enterprise-grade authentication and authorization! 🚀
