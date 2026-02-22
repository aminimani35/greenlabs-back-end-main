# Quick Start Guide - Vertical Slice Architecture

## Project Structure Overview

```
src/
├── common/              # Shared utilities and infrastructure
├── features/           # Feature slices (Users, Products, etc.)
│   └── [feature]/
│       ├── commands/   # Write operations (Create, Update, Delete)
│       ├── queries/    # Read operations (Get, List)
│       ├── domain/     # Business entities
│       └── repositories/  # Data access layer
└── main.ts
```

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# The API will be available at http://localhost:3000/api
```

## Available Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe"
  }
  ```
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
  ```json
  {
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description"
  }
  ```

## Testing with curl

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"name\":\"Test User\"}"

# Get all users
curl http://localhost:3000/api/users

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Laptop\",\"price\":999.99,\"description\":\"Gaming laptop\"}"
```

## Key Concepts

### 1. Feature Slices
Each feature (Users, Products) is completely self-contained with its own:
- Controllers
- Handlers
- Repositories
- DTOs
- Domain models

### 2. CQRS Pattern
Operations are split into:
- **Commands**: Modify state (Create, Update, Delete)
- **Queries**: Read state (Get, List)

### 3. Handlers
Each operation has a dedicated handler with a single responsibility:
- `CreateUserHandler` - Creates a user
- `GetUserHandler` - Retrieves a user
- etc.

### 4. Benefits
- ✅ Clear separation of concerns
- ✅ Easy to add new features
- ✅ Testable code
- ✅ Minimal coupling between features
- ✅ Scalable architecture

## Next Steps

1. Review the `ARCHITECTURE.md` for detailed documentation
2. Explore the Users and Products features as examples
3. Add new features following the same pattern
4. Integrate with a real database (TypeORM, Prisma, etc.)
5. Add validation using class-validator
6. Add Swagger documentation
7. Add unit and integration tests

## Adding a Database

To replace the in-memory storage with a real database:

### Option 1: TypeORM
```bash
npm install @nestjs/typeorm typeorm pg
```

### Option 2: Prisma
```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

Then update the repositories to use the ORM of your choice.
