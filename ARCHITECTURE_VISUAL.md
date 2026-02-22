# Vertical Slice Architecture - Visual Guide

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTTP REQUEST                              │
│                     (e.g., POST /api/users)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONTROLLER LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  UsersController                                         │   │
│  │  - Receives HTTP request                                 │   │
│  │  - Validates DTO                                         │   │
│  │  - Creates Command/Query                                 │   │
│  │  - Calls Handler                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COMMAND/QUERY LAYER                           │
│                                                                  │
│  ┌─────────────────────┐         ┌─────────────────────┐       │
│  │   COMMANDS          │         │    QUERIES          │       │
│  │   (Write Ops)       │         │    (Read Ops)       │       │
│  ├─────────────────────┤         ├─────────────────────┤       │
│  │ CreateUserCommand   │         │ GetUserQuery        │       │
│  │ UpdateUserCommand   │         │ GetUsersQuery       │       │
│  │ DeleteUserCommand   │         │                     │       │
│  └──────────┬──────────┘         └──────────┬──────────┘       │
│             │                               │                   │
│             ▼                               ▼                   │
│  ┌─────────────────────┐         ┌─────────────────────┐       │
│  │ CreateUserHandler   │         │ GetUserHandler      │       │
│  │ - Business Logic    │         │ - Data Retrieval    │       │
│  │ - Validation        │         │ - Formatting        │       │
│  └──────────┬──────────┘         └──────────┬──────────┘       │
└─────────────┼──────────────────────────────┼──────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REPOSITORY LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  UserRepository                                          │   │
│  │  - Data Access Abstraction                              │   │
│  │  - CRUD Operations                                       │   │
│  │  - Database Queries                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│                  (In-Memory / Database)                          │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Example

### Creating a User (Command)

```
1. HTTP Request
   POST /api/users
   Body: { "email": "john@example.com", "name": "John Doe" }
   
   ↓

2. Controller
   UsersController.createUser(dto: CreateUserDto)
   - Validates DTO
   - Creates: new CreateUserCommand(dto.email, dto.name)
   
   ↓

3. Handler
   CreateUserHandler.handle(command)
   - Checks if user exists (business rule)
   - Calls repository.create()
   
   ↓

4. Repository
   UserRepository.create(userData)
   - Saves to database
   - Returns User entity
   
   ↓

5. Response
   { "success": true, "data": { user }, "message": "User created" }
```

### Getting a User (Query)

```
1. HTTP Request
   GET /api/users/123
   
   ↓

2. Controller
   UsersController.getUser(id: string)
   - Creates: new GetUserQuery(id)
   
   ↓

3. Handler
   GetUserHandler.handle(query)
   - Calls repository.findById()
   - Throws NotFoundException if not found
   
   ↓

4. Repository
   UserRepository.findById(id)
   - Queries database
   - Returns User entity or null
   
   ↓

5. Response
   { "success": true, "data": { user }, "message": "User retrieved" }
```

## 🏗️ Feature Structure

Each feature slice is organized as:

```
features/users/
│
├── commands/                    # Write operations (state changes)
│   ├── create-user/
│   │   ├── create-user.dto.ts      ← Input validation
│   │   ├── create-user.command.ts  ← Command object
│   │   └── create-user.handler.ts  ← Business logic
│   ├── update-user/
│   └── delete-user/
│
├── queries/                     # Read operations (no state changes)
│   ├── get-user/
│   │   ├── get-user.query.ts       ← Query parameters
│   │   └── get-user.handler.ts     ← Data retrieval logic
│   └── get-users/
│
├── domain/                      # Business entities
│   └── user.entity.ts              ← Domain model
│
├── repositories/                # Data access
│   └── user.repository.ts          ← Database abstraction
│
├── users.controller.ts          # HTTP endpoints
└── users.module.ts              # Dependency injection
```

## 🎯 Key Principles

### 1. Feature Independence
```
✅ Each feature is self-contained
✅ Features don't depend on each other
✅ Can be developed/tested/deployed independently
```

### 2. CQRS Separation
```
Commands (CUD)          Queries (R)
─────────────          ──────────
Create User            Get User
Update User            Get Users
Delete User            Search Users

• Commands modify state    • Queries read state
• Can be complex          • Optimized for reads
• Business rules apply    • No side effects
```

### 3. Single Responsibility
```
Each handler does ONE thing:
• CreateUserHandler  → Creates users
• GetUserHandler     → Retrieves one user
• GetUsersHandler    → Retrieves all users
```

## 📦 Dependency Flow

```
Controller → Handler → Repository → Database
    ↓          ↓           ↓
  Slim     Business    Data
  HTTP     Logic       Access
  Layer    Layer       Layer
```

## 🔄 Comparison with Traditional Layered Architecture

### Traditional (Horizontal Layers)
```
controllers/
  ├── users.controller.ts
  └── products.controller.ts
services/
  ├── users.service.ts
  └── products.service.ts
repositories/
  ├── users.repository.ts
  └── products.repository.ts
entities/
  ├── user.entity.ts
  └── product.entity.ts

Problem: Changes to a feature require
         editing files in multiple folders
```

### Vertical Slice (Feature-Based)
```
features/
  ├── users/
  │   ├── commands/
  │   ├── queries/
  │   ├── domain/
  │   └── repositories/
  └── products/
      ├── commands/
      ├── queries/
      ├── domain/
      └── repositories/

Benefit: Everything related to a feature
         is in one place
```

## 🎨 Benefits Visualization

```
┌──────────────────────────────────────────────────────────┐
│              VERTICAL SLICE BENEFITS                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📁 Organization    All user code in /users             │
│                     Easy to find and navigate            │
│                                                          │
│  🔧 Maintenance     Changes isolated to one folder       │
│                     Less chance of breaking other code   │
│                                                          │
│  🧪 Testing         Test entire feature in isolation     │
│                     Mock only what you need              │
│                                                          │
│  👥 Team Work       Different teams → different features │
│                     Minimal merge conflicts              │
│                                                          │
│  📈 Scalability     Add features without touching others │
│                     Grow codebase linearly               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 🚀 Adding a New Feature - Quick Guide

```bash
# 1. Create folder structure
mkdir -p src/features/orders/{commands,queries,domain,repositories}

# 2. Create files
src/features/orders/
├── commands/
│   └── create-order/
│       ├── create-order.dto.ts
│       ├── create-order.command.ts
│       └── create-order.handler.ts
├── queries/
│   └── get-order/
│       ├── get-order.query.ts
│       └── get-order.handler.ts
├── domain/
│   └── order.entity.ts
├── repositories/
│   └── order.repository.ts
├── orders.controller.ts
└── orders.module.ts

# 3. Register in AppModule
# 4. Start building!
```

## 📊 Code Organization Metrics

```
Traditional Architecture    Vertical Slice Architecture
─────────────────────────   ──────────────────────────
Files per feature: ~8       Files per feature: ~8
Folders touched: 4          Folders touched: 1
Lines to navigate: 100+     Lines to navigate: ~50
Coupling: High              Coupling: Low
Cohesion: Low               Cohesion: High
```
