# Vertical Slice Architecture

## Overview

This project follows the **Vertical Slice Architecture** pattern, which organizes code by features rather than technical layers. Each feature is a self-contained vertical slice that includes all the necessary components (controllers, handlers, repositories, DTOs, etc.).

## Architecture Principles

1. **Feature-First Organization**: Code is organized by features/use cases, not by technical layers
2. **CQRS Pattern**: Commands (writes) and Queries (reads) are separated
3. **Single Responsibility**: Each handler has one responsibility
4. **Dependency Inversion**: Features depend on abstractions, not implementations
5. **Encapsulation**: Each feature is self-contained and minimizes coupling

## Folder Structure

```
src/
├── common/                    # Shared infrastructure
│   ├── decorators/           # Custom decorators
│   ├── filters/              # Exception filters
│   ├── pipes/                # Validation pipes
│   └── interfaces/           # Shared interfaces
├── features/                 # Feature slices
│   ├── users/               # User feature
│   │   ├── commands/        # Write operations
│   │   │   ├── create-user/
│   │   │   │   ├── create-user.command.ts
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── create-user.handler.ts
│   │   │   ├── update-user/
│   │   │   └── delete-user/
│   │   ├── queries/         # Read operations
│   │   │   ├── get-user/
│   │   │   │   ├── get-user.query.ts
│   │   │   │   └── get-user.handler.ts
│   │   │   └── get-users/
│   │   ├── domain/          # Domain entities
│   │   │   └── user.entity.ts
│   │   ├── repositories/    # Data access
│   │   │   └── user.repository.ts
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   └── products/            # Product feature
│       └── ...
└── main.ts
```

## Key Components

### 1. Commands (Write Operations)
Commands represent intentions to change state:
- **Command**: Plain object containing data
- **Handler**: Executes business logic
- **DTO**: Data Transfer Object for validation

### 2. Queries (Read Operations)
Queries represent data retrieval:
- **Query**: Plain object with query parameters
- **Handler**: Retrieves and returns data

### 3. Domain
Contains business entities and value objects

### 4. Repositories
Abstraction layer for data access

### 5. Controllers
HTTP endpoints that orchestrate commands/queries

## Adding a New Feature

1. Create feature folder: `src/features/[feature-name]/`
2. Create module: `[feature-name].module.ts`
3. Create controller: `[feature-name].controller.ts`
4. Create domain entities in `domain/`
5. Create repository in `repositories/`
6. Add commands in `commands/[command-name]/`
7. Add queries in `queries/[query-name]/`
8. Register module in `app.module.ts`

## Example: Adding a New Command

```typescript
// 1. Create DTO
export class CreateOrderDto {
  userId: string;
  productId: string;
  quantity: number;
}

// 2. Create Command
export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly productId: string,
    public readonly quantity: number,
  ) {}
}

// 3. Create Handler
@Injectable()
export class CreateOrderHandler {
  constructor(private readonly orderRepository: OrderRepository) {}

  async handle(command: CreateOrderCommand): Promise<Order> {
    // Business logic here
    return await this.orderRepository.create({
      userId: command.userId,
      productId: command.productId,
      quantity: command.quantity,
    });
  }
}

// 4. Register in Module
@Module({
  providers: [CreateOrderHandler],
})
export class OrdersModule {}

// 5. Use in Controller
@Post()
async createOrder(@Body() dto: CreateOrderDto) {
  const command = new CreateOrderCommand(dto.userId, dto.productId, dto.quantity);
  const order = await this.createOrderHandler.handle(command);
  return ApiResponse.ok(order);
}
```

## Benefits

✅ **Easy to Understand**: Each feature is self-contained
✅ **Easy to Test**: Handlers can be tested independently
✅ **Reduced Coupling**: Features don't depend on each other
✅ **Scalability**: Easy to add new features without affecting existing ones
✅ **Maintainability**: Changes are localized to specific features
✅ **Team Collaboration**: Different teams can work on different features

## Testing Strategy

- **Unit Tests**: Test handlers in isolation
- **Integration Tests**: Test feature slices end-to-end
- **E2E Tests**: Test API endpoints

## Common Patterns

### Error Handling
Use NestJS built-in exceptions:
- `NotFoundException`
- `BadRequestException`
- `ConflictException`
- etc.

### Response Format
Use `ApiResponse` wrapper for consistent responses:
```typescript
return ApiResponse.ok(data, 'Success message');
return ApiResponse.fail('Error message');
```

### Validation
Add validation using class-validator decorators in DTOs

## Migration from Traditional Layered Architecture

If migrating from a traditional layered architecture:
1. Identify business features/use cases
2. Group related operations into feature slices
3. Move shared code to `common/`
4. Convert service methods to command/query handlers
5. Update imports and module dependencies

## Resources

- [Vertical Slice Architecture by Jimmy Bogard](https://www.jimmybogard.com/vertical-slice-architecture/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [NestJS Documentation](https://docs.nestjs.com/)
