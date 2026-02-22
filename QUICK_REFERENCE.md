# 🚀 Quick Reference Card

## URLs (When Server is Running)

```
📍 API Base:      http://localhost:3000/api
📚 Swagger UI:    http://localhost:3000/api/docs
✨ Scalar Docs:   http://localhost:3000/api/reference
```

## Commands

```bash
# Development (with hot reload)
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov

# Linting
npm run lint
npm run format
```

## Hot Reload Status
✅ **ENABLED** by default with `npm run start:dev`
- File changes auto-detected
- Application auto-restarts
- No manual intervention needed

## API Endpoints

### Users
```
GET    /api/users          # List all users
GET    /api/users/:id      # Get user by ID
POST   /api/users          # Create user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

### Products
```
GET    /api/products       # List all products
GET    /api/products/:id   # Get product by ID
POST   /api/products       # Create product
```

## Quick Test Commands

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Get all users
curl http://localhost:3000/api/users

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99}'

# Get all products
curl http://localhost:3000/api/products
```

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main overview |
| `ARCHITECTURE.md` | Detailed architecture |
| `ARCHITECTURE_VISUAL.md` | Diagrams & visuals |
| `DOCUMENTATION_GUIDE.md` | Swagger & Scalar guide |
| `IMPLEMENTATION_SUMMARY.md` | What was implemented |
| This file | Quick reference |

## Adding a New Feature

```bash
# 1. Create folder structure
mkdir -p src/features/orders/{commands,queries,domain,repositories}

# 2. Create files (following users/products example)
# - commands/create-order/
# - queries/get-order/
# - domain/order.entity.ts
# - repositories/order.repository.ts
# - orders.controller.ts
# - orders.module.ts

# 3. Register in app.module.ts
# 4. Start coding!
```

## Swagger Decorators Cheatsheet

```typescript
// On Controller
@ApiTags('Users')

// On Method
@ApiOperation({ summary: 'Get all users' })
@ApiResponse({ status: 200, description: 'Success' })
@ApiResponse({ status: 404, description: 'Not found' })

// On DTO
@ApiProperty({ description: 'User email', example: 'user@example.com' })
@ApiPropertyOptional({ description: 'Optional field' })
```

## Validation Decorators

```typescript
import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@IsString()
@IsEmail()
@IsNotEmpty()
@IsOptional()
@MinLength(2)
```

## Project Structure

```
src/
├── common/              # Shared code
├── features/           # Feature slices
│   ├── users/
│   │   ├── commands/   # Write ops
│   │   ├── queries/    # Read ops
│   │   ├── domain/     # Entities
│   │   └── repositories/
│   └── products/
├── app.module.ts
└── main.ts
```

## Remember

✅ Hot reload is automatic - just save files
✅ Documentation auto-updates from code
✅ Each feature is self-contained
✅ Use Swagger/Scalar for testing
✅ Follow the vertical slice pattern

## Need Help?

1. Check `ARCHITECTURE.md` for architecture details
2. Read `DOCUMENTATION_GUIDE.md` for API docs help
3. View `ARCHITECTURE_VISUAL.md` for diagrams
4. See `IMPLEMENTATION_SUMMARY.md` for overview

---

**Server Running?** Check: http://localhost:3000/api/docs

**Have fun building! 🎉**
