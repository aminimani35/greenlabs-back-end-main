# Greenlabs Backend - Vertical Slice Architecture

A NestJS backend application implementing **Vertical Slice Architecture** with CQRS pattern.

## 🏗️ Architecture Overview

This project follows the **Vertical Slice Architecture** pattern, organizing code by business features rather than technical layers. Each feature is a self-contained vertical slice with all necessary components.

### Key Benefits

- ✅ **Feature Independence**: Each feature is isolated and self-contained
- ✅ **Easy to Navigate**: All related code for a feature is in one place
- ✅ **Scalable**: Add new features without affecting existing ones
- ✅ **Testable**: Handlers can be tested in isolation
- ✅ **Maintainable**: Changes are localized to specific features

## Description

Built with [NestJS](https://github.com/nestjs/nest) framework using TypeScript and following clean architecture principles.


## 📁 Project Structure

```
src/
├── common/                          # Shared infrastructure
│   ├── decorators/                  # Custom decorators
│   ├── filters/                     # Exception filters
│   ├── interfaces/                  # Shared interfaces
│   └── pipes/                       # Validation pipes
├── features/                        # Feature slices
│   ├── users/                       # User feature (CRUD)
│   │   ├── commands/                # Write operations
│   │   ├── queries/                 # Read operations
│   │   ├── domain/                  # Domain entities
│   │   └── repositories/            # Data access
│   └── products/                    # Product feature (CRUD)
│       └── ...
├── app.module.ts                    # Root module
└── main.ts                          # Application entry
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

**URLs:**
- 📍 API Base: http://localhost:3000/api
- 📚 Swagger Docs: http://localhost:3000/api/docs
- ✨ Scalar Docs: http://localhost:3000/api/reference

### Hot Reload
The development server (`npm run start:dev`) includes **automatic hot reload**:
- ✅ File changes detected automatically
- ✅ Application restarts instantly
- ✅ No manual intervention needed
- ✅ Fast development iteration

## 📚 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product

**Example Request:**
```json
POST /api/users
{
  "email": "john@example.com",
  "name": "John Doe"
}
```


## 🧪 Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🏛️ Architecture Patterns

### CQRS Pattern
- **Commands**: Modify state (Create, Update, Delete)
- **Queries**: Read state (Get, List)
- Each operation has a dedicated handler with single responsibility

### Vertical Slices
Each feature is self-contained with:
- Controllers (HTTP endpoints)
- Commands & Queries (business operations)
- Domain entities
- Repositories (data access)

## 📖 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md) - Visual architecture guide with diagrams
- [DOCUMENTATION_GUIDE.md](./DOCUMENTATION_GUIDE.md) - API documentation guide (Swagger & Scalar)
- [README_ARCHITECTURE.md](./README_ARCHITECTURE.md) - Quick start guide

### Interactive API Documentation
- **Swagger UI**: http://localhost:3000/api/docs - Classic interactive API docs
- **Scalar**: http://localhost:3000/api/reference - Modern, beautiful API reference

## Resources

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)

## License

UNLICENSED

