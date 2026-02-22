# Authentication & RBAC System

## Overview

This application implements a complete enterprise-level identity and access management system with JWT-based authentication and Role-Based Access Control (RBAC).

## Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Fine-grained permission system
- **Password Hashing**: Bcrypt encryption for secure password storage
- **Auth Guards**: Protect routes with decorators
- **Public Routes**: Opt-out from authentication when needed
- **Auto-seeding**: Automatic creation of default roles and permissions

## Architecture

### Entities

1. **User**: Core user entity with authentication credentials
2. **Role**: User roles (admin, editor, user, etc.)
3. **Permission**: Fine-grained permissions (resource:action format)

### Relationships

- User ↔ Role: Many-to-Many
- Role ↔ Permission: Many-to-Many

## Default Roles & Permissions

### Admin Role

Full access to all resources:

- All blog permissions (create, read, update, delete, publish)
- All user permissions (create, read, update, delete)
- All product permissions (create, read, update, delete)

### Editor Role

Content management access:

- Blog: create, read, update, publish
- Product: create, read, update

### User Role

Read-only access:

- Blog: read
- Product: read
- User: read

## API Endpoints

### Authentication

**Register User**

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePassword123!",
  "roleIds": ["uuid-of-role"] // Optional
}
```

**Login**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": [...]
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Get Profile**

```http
GET /api/auth/profile
Authorization: Bearer <token>
```

## Using Authentication in Your Code

### Protecting Endpoints

#### Require Authentication (Default)

All endpoints require authentication by default:

```typescript
@Get('protected')
async protectedRoute() {
  return 'This requires authentication';
}
```

#### Public Endpoints

Use `@Public()` decorator to allow unauthenticated access:

```typescript
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Get('public')
async publicRoute() {
  return 'Anyone can access this';
}
```

#### Role-Based Protection

Use `@Roles()` decorator to require specific roles:

```typescript
import { Roles } from '../auth/decorators/roles.decorator';

@Roles('admin', 'editor')
@Post('create')
async createResource() {
  return 'Only admins and editors can access this';
}
```

#### Permission-Based Protection

Use `@RequirePermissions()` decorator for fine-grained control:

```typescript
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@RequirePermissions('blog:create', 'blog:publish')
@Post('blog')
async createAndPublishBlog() {
  return 'Requires both blog:create and blog:publish permissions';
}
```

#### Combining Guards

You can combine multiple decorators:

```typescript
@Roles('admin', 'editor')
@RequirePermissions('blog:publish')
@ApiBearerAuth('JWT-auth')
@Patch(':id/publish')
async publishBlog(@Param('id') id: string) {
  // Only admins/editors with blog:publish permission can access
}
```

### Getting Current User

Use `@CurrentUser()` decorator to access the authenticated user:

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Get('me')
async getCurrentUser(@CurrentUser() user: any) {
  // user contains: { userId, email, roles, permissions }
  return user;
}
```

## Environment Variables

Required environment variables in `.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Database (already configured)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=greenlabs_db
```

## Guards

### JwtAuthGuard

- Applied globally to all routes
- Validates JWT tokens
- Respects `@Public()` decorator

### RolesGuard

- Applied globally
- Checks if user has required roles
- Works with `@Roles()` decorator

### PermissionsGuard

- Applied globally
- Checks if user has required permissions
- Works with `@RequirePermissions()` decorator

## Permission Naming Convention

Permissions follow the format: `resource:action`

Examples:

- `blog:create` - Create blog posts
- `blog:read` - Read blog posts
- `blog:update` - Update blog posts
- `blog:delete` - Delete blog posts
- `blog:publish` - Publish/unpublish blog posts
- `user:create` - Create users
- `product:update` - Update products

## Security Best Practices

1. **Never commit `.env` file** - Use `.env.example` as template
2. **Use strong JWT secrets** - Generate random, long secrets for production
3. **Implement password policies** - Enforce strong passwords
4. **Use HTTPS in production** - Always encrypt traffic
5. **Rotate JWT secrets periodically** - Change secrets regularly
6. **Implement rate limiting** - Prevent brute force attacks
7. **Log authentication events** - Monitor for suspicious activity

## Testing Authentication

### Using Swagger UI

1. Navigate to `http://localhost:3000/api/docs`
2. Click **Authorize** button
3. Enter Bearer token: `Bearer <your-token>`
4. Click **Authorize**
5. Test protected endpoints

### Using curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Access protected route
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your-token>"
```

## Extending the System

### Adding New Permissions

1. Add permission to seed data in `auth-seeder.service.ts`
2. Restart application to run seeder
3. Use `@RequirePermissions('new:permission')` on endpoints

### Adding New Roles

1. Add role configuration to `auth-seeder.service.ts`
2. Assign appropriate permissions
3. Restart application to run seeder

### Custom Guards

Create custom guards by implementing `CanActivate`:

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Your custom logic
    return true;
  }
}
```

## Database Schema

The authentication system creates these tables:

- `users` - User accounts
- `roles` - Available roles
- `permissions` - Available permissions
- `user_roles` - User-Role relationships
- `role_permissions` - Role-Permission relationships

## Troubleshooting

### Token expired

- Tokens expire after 24 hours by default
- User needs to login again
- Adjust `JWT_EXPIRES_IN` in `.env`

### Forbidden errors

- User doesn't have required role or permission
- Check user's roles and permissions
- Verify decorator configuration

### Unauthorized errors

- No token provided
- Invalid token
- Token expired
- Check Authorization header format: `Bearer <token>`
