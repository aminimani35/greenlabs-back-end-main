# API Documentation Guide

## 📚 Available Documentation Tools

This project includes two powerful API documentation tools:

### 1. Swagger UI (Classic)
- **URL**: http://localhost:3000/api/docs
- **Features**:
  - Interactive API testing
  - Request/response examples
  - Schema definitions
  - Try-it-out functionality

### 2. Scalar API Reference (Modern)
- **URL**: http://localhost:3000/api/reference
- **Features**:
  - Beautiful, modern UI
  - Dark/Light theme
  - Better readability
  - Enhanced developer experience
  - Interactive examples

## 🚀 Quick Start

### Start the Development Server

```bash
npm run start:dev
```

The application starts with **hot reload enabled**, which means:
- ✅ Code changes are automatically detected
- ✅ Application restarts automatically
- ✅ No need to manually restart the server
- ✅ Fast development iteration

### Access Documentation

Once the server is running, visit:

1. **Swagger**: http://localhost:3000/api/docs
2. **Scalar**: http://localhost:3000/api/reference

## 📝 Adding Documentation to Your Code

### Documenting DTOs

Add `@ApiProperty` decorators to your DTO classes:

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'User age (optional)',
    example: 25,
    minimum: 18,
  })
  age?: number;
}
```

### Documenting Controllers

Add `@ApiTags` and `@ApiOperation` decorators to your controllers:

```typescript
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async getUsers() {
    // Implementation
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUser(@Param('id') id: string) {
    // Implementation
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with email and name',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async createUser(@Body() dto: CreateUserDto) {
    // Implementation
  }
}
```

### Documenting Response Models

Create response DTOs and document them:

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '2026-02-22T10:00:00.000Z' })
  createdAt: Date;
}

export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  error?: string;
}
```

## 🔧 Configuration

The documentation is configured in `src/main.ts`:

```typescript
// Swagger configuration
const config = new DocumentBuilder()
  .setTitle('Greenlabs API')
  .setDescription('API documentation for Greenlabs backend')
  .setVersion('1.0')
  .addTag('Users', 'User management endpoints')
  .addTag('Products', 'Product management endpoints')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### Adding Authentication

To add authentication to your API documentation:

```typescript
const config = new DocumentBuilder()
  .setTitle('Greenlabs API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .addBearerAuth() // Add JWT authentication
  .addApiKey() // Or API key authentication
  .build();
```

Then in your controllers:

```typescript
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  // Your endpoints
}
```

## 🎨 Customizing Scalar Theme

You can customize the Scalar theme in `src/main.ts`:

```typescript
const scalarConfig = {
  spec: {
    content: document,
  },
  theme: 'purple', // Options: 'purple', 'blue', 'green', 'mars', 'moon'
  darkMode: true,
  layout: 'modern',
};
```

## 📊 Testing API Endpoints

### Using Swagger UI

1. Navigate to http://localhost:3000/api/docs
2. Find your endpoint
3. Click "Try it out"
4. Fill in the parameters
5. Click "Execute"
6. View the response

### Using Scalar

1. Navigate to http://localhost:3000/api/reference
2. Browse endpoints in the sidebar
3. Click on an endpoint
4. View examples and schemas
5. Test requests directly in the UI

### Using cURL

```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Get user by ID
curl http://localhost:3000/api/users/1

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

## 🔥 Hot Reload

The development server runs with hot reload enabled by default when using:

```bash
npm run start:dev
```

**What this means:**
- File changes are detected automatically
- Application recompiles and restarts
- No manual intervention needed
- Fast development cycle

**Files watched:**
- All `.ts` files in `src/`
- Configuration files
- Module files

**To disable hot reload:**
```bash
npm run start  # Regular start without watch mode
```

## 📋 Best Practices

### 1. Always Document DTOs
```typescript
// ❌ Bad
export class CreateUserDto {
  email: string;
  name: string;
}

// ✅ Good
export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsString()
  name: string;
}
```

### 2. Document All Response Codes
```typescript
@ApiResponse({ status: 200, description: 'Success' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiResponse({ status: 404, description: 'Not Found' })
@ApiResponse({ status: 500, description: 'Internal Server Error' })
```

### 3. Use Meaningful Examples
```typescript
@ApiProperty({
  description: 'User email address',
  example: 'john.doe@example.com', // ✅ Good example
  // example: 'test@test.com', // ❌ Generic example
})
email: string;
```

### 4. Group Endpoints with Tags
```typescript
@ApiTags('Users')  // Groups all user endpoints
@Controller('users')
export class UsersController {}

@ApiTags('Products')  // Groups all product endpoints
@Controller('products')
export class ProductsController {}
```

## 🛠️ Troubleshooting

### Documentation not showing?
- Ensure `@nestjs/swagger` is installed
- Check that decorators are properly imported
- Verify the server is running on the correct port

### Changes not reflecting?
- Hot reload should handle this automatically
- If not, restart the server: `Ctrl+C` then `npm run start:dev`
- Clear browser cache

### Validation not working?
- Ensure `class-validator` and `class-transformer` are installed
- Verify `ValidationPipe` is enabled globally in `main.ts`
- Check that decorators are properly applied to DTOs

## 📚 Additional Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [Scalar Documentation](https://github.com/scalar/scalar)
- [OpenAPI Specification](https://swagger.io/specification/)
- [class-validator Documentation](https://github.com/typestack/class-validator)
