# CRM Module - Customer Relationship Management

## 🎉 Overview

A comprehensive enterprise CRM (Customer Relationship Management) module for managing customers, support tickets, notes, and activities.

## ✅ Features Implemented

### Customer Management

- ✅ Create, read, update, delete customers
- ✅ Customer status tracking (Lead, Prospect, Active, Inactive, Churned)
- ✅ Customer priority levels (Low, Medium, High, VIP)
- ✅ Customer types (Individual, Business, Enterprise)
- ✅ Contact information management
- ✅ Company and job title tracking
- ✅ Address and location data
- ✅ Social media links (LinkedIn, Twitter, Website)
- ✅ Custom tags and fields
- ✅ Lifetime value tracking
- ✅ Acquisition source tracking
- ✅ Assignment to sales/support reps
- ✅ Activity timeline
- ✅ Customer statistics dashboard

### Support Ticket System

- ✅ Create, read, update, delete support tickets
- ✅ Auto-generated ticket numbers (TKT-000001)
- ✅ Ticket status tracking (Open, In Progress, Waiting, Resolved, Closed)
- ✅ Priority levels (Low, Medium, High, Urgent, Critical)
- ✅ Categories (Technical, Billing, General, Feature Request, Bug Report, Account, Other)
- ✅ Ticket assignment to support agents
- ✅ Due date management
- ✅ First response time tracking
- ✅ Resolution and closure timestamps
- ✅ Ticket comments and internal notes
- ✅ Response count tracking
- ✅ Ticket statistics dashboard

### Notes & Activities

- ✅ Customer notes with types (General, Meeting, Call, Email, Task, Reminder)
- ✅ Pinned notes for important information
- ✅ Automatic activity logging for all actions
- ✅ Activity types (Created, Updated, Status Changed, Note Added, Ticket Created, etc.)
- ✅ Complete audit trail
- ✅ Activity timeline with metadata

### Advanced Features

- ✅ Full-text search for customers and tickets
- ✅ Advanced filtering (status, priority, assignment, tags)
- ✅ Pagination support
- ✅ Statistics and analytics
- ✅ Role-based access control
- ✅ Permission-based operations
- ✅ Complete API documentation via Swagger

## 📚 Database Schema

### Entities

1. **Customer** - Core customer information
2. **SupportTicket** - Support ticket management
3. **TicketComment** - Comments on tickets
4. **CustomerNote** - Notes about customers
5. **CustomerActivity** - Audit log of all customer-related activities

### Relationships

- Customer → SupportTicket (One-to-Many)
- Customer → CustomerNote (One-to-Many)
- Customer → CustomerActivity (One-to-Many)
- SupportTicket → TicketComment (One-to-Many)

## 🚀 API Endpoints

### Customer Endpoints

#### Create Customer

```http
POST /api/crm/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "jobTitle": "CEO",
  "type": "business",
  "status": "active",
  "priority": "vip",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "website": "https://acme.com",
  "tags": ["enterprise", "premium"],
  "acquisitionSource": "referral",
  "notes": "Important client"
}
```

**Required Permissions:** `crm:customer:create`
**Required Roles:** `admin`, `editor`

#### Get All Customers

```http
GET /api/crm/customers?status=active&page=1&limit=20&search=john
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` - Filter by status (lead, prospect, active, inactive, churned)
- `priority` - Filter by priority (low, medium, high, vip)
- `search` - Search in name, email, company
- `assignedTo` - Filter by assigned user ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Required Permissions:** `crm:customer:read`

#### Get Customer by ID

```http
GET /api/crm/customers/:id
Authorization: Bearer <token>
```

**Required Permissions:** `crm:customer:read`

#### Update Customer

```http
PUT /api/crm/customers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active",
  "priority": "vip",
  "notes": "Updated notes"
}
```

**Required Permissions:** `crm:customer:update`
**Required Roles:** `admin`, `editor`

#### Delete Customer

```http
DELETE /api/crm/customers/:id
Authorization: Bearer <token>
```

**Required Permissions:** `crm:customer:delete`
**Required Roles:** `admin`

#### Get Customer Activities

```http
GET /api/crm/customers/:id/activities?limit=50
Authorization: Bearer <token>
```

**Required Permissions:** `crm:activity:read`

#### Get Customer Notes

```http
GET /api/crm/customers/:id/notes
Authorization: Bearer <token>
```

**Required Permissions:** `crm:note:read`

#### Get Customer Statistics

```http
GET /api/crm/customers/statistics
Authorization: Bearer <token>
```

**Response:**

```json
{
  "total": 1250,
  "active": 850,
  "leads": 200,
  "prospects": 150,
  "vip": 50
}
```

**Required Permissions:** `crm:customer:read`

### Support Ticket Endpoints

#### Create Ticket

```http
POST /api/crm/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Unable to login",
  "description": "I cannot access my account...",
  "customerId": "customer-uuid",
  "priority": "high",
  "category": "technical",
  "tags": ["urgent", "login-issue"]
}
```

**Required Permissions:** `crm:ticket:create`
**Required Roles:** `admin`, `editor`

#### Get All Tickets

```http
GET /api/crm/tickets?status=open&priority=high&page=1
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` - Filter by status
- `priority` - Filter by priority
- `category` - Filter by category
- `customerId` - Filter by customer
- `assignedTo` - Filter by assigned agent
- `search` - Search in subject, ticket number
- `page`, `limit` - Pagination

**Required Permissions:** `crm:ticket:read`

#### Get Ticket by ID

```http
GET /api/crm/tickets/:id
Authorization: Bearer <token>
```

**Required Permissions:** `crm:ticket:read`

#### Update Ticket

```http
PUT /api/crm/tickets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "urgent"
}
```

**Required Permissions:** `crm:ticket:update`
**Required Roles:** `admin`, `editor`

#### Assign Ticket

```http
PATCH /api/crm/tickets/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignedTo": "user-uuid",
  "assignedAgentName": "Jane Smith"
}
```

**Required Permissions:** `crm:ticket:assign`
**Required Roles:** `admin`, `editor`

#### Resolve Ticket

```http
PATCH /api/crm/tickets/:id/resolve
Authorization: Bearer <token>
```

**Required Permissions:** `crm:ticket:update`
**Required Roles:** `admin`, `editor`

#### Close Ticket

```http
PATCH /api/crm/tickets/:id/close
Authorization: Bearer <token>
```

**Required Permissions:** `crm:ticket:update`
**Required Roles:** `admin`, `editor`

#### Delete Ticket

```http
DELETE /api/crm/tickets/:id
Authorization: Bearer <token>
```

**Required Permissions:** `crm:ticket:delete`
**Required Roles:** `admin`

#### Get Ticket Statistics

```http
GET /api/crm/tickets/statistics
Authorization: Bearer <token>
```

**Response:**

```json
{
  "total": 450,
  "open": 120,
  "inProgress": 80,
  "resolved": 200,
  "closed": 50,
  "urgent": 25,
  "critical": 10
}
```

**Required Permissions:** `crm:ticket:read`

### Comment Endpoints

#### Add Comment to Ticket

```http
POST /api/crm/tickets/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "I've looked into this issue...",
  "isInternal": false
}
```

**Required Permissions:** `crm:ticket:update`
**Required Roles:** `admin`, `editor`

#### Get Ticket Comments

```http
GET /api/crm/tickets/:id/comments
Authorization: Bearer <token>
```

**Required Permissions:** `crm:ticket:read`

### Note Endpoints

#### Create Customer Note

```http
POST /api/crm/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "customer-uuid",
  "title": "Important Meeting",
  "content": "Discussed contract renewal...",
  "tags": ["meeting", "contract"]
}
```

**Required Permissions:** `crm:note:create`
**Required Roles:** `admin`, `editor`

#### Delete Note

```http
DELETE /api/crm/notes/:id
Authorization: Bearer <token>
```

**Required Permissions:** `crm:note:create`
**Required Roles:** `admin`, `editor`

## 🔐 Permissions

All CRM permissions have been automatically seeded:

### Customer Permissions

- `crm:customer:create` - Create customers
- `crm:customer:read` - Read customers
- `crm:customer:update` - Update customers
- `crm:customer:delete` - Delete customers

### Ticket Permissions

- `crm:ticket:create` - Create tickets
- `crm:ticket:read` - Read tickets
- `crm:ticket:update` - Update tickets
- `crm:ticket:delete` - Delete tickets
- `crm:ticket:assign` - Assign tickets

### Note & Activity Permissions

- `crm:note:create` - Create notes
- `crm:note:read` - Read notes
- `crm:activity:read` - Read activities

## 👤 Super Admin User

A super admin user has been automatically created with:

- **Email:** aminimani95@proton.me
- **Password:** Ar@d1260621
- **Role:** Admin (all permissions)

## 📊 Customer Lifecycle Stages

1. **Lead** - Initial contact, not yet qualified
2. **Prospect** - Qualified lead, potential customer
3. **Active** - Current paying customer
4. **Inactive** - Not currently engaging
5. **Churned** - Lost customer

## 🎫 Ticket Workflow

1. **Open** - New ticket created
2. **In Progress** - Agent working on it
3. **Waiting Customer** - Waiting for customer response
4. **Waiting Internal** - Waiting for internal team
5. **Resolved** - Issue fixed, awaiting confirmation
6. **Closed** - Ticket completed

## 🔧 Usage Examples

### Using Swagger UI

1. Navigate to: `http://localhost:3000/api/docs`
2. Click **Authorize** button
3. Login with super admin credentials
4. Copy the access_token
5. Enter: `Bearer <your-token>`
6. Test all CRM endpoints under the **CRM** section

### Using curl

```bash
# Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aminimani95@proton.me","password":"Ar@d1260621"}' \
  | jq -r '.access_token')

# Create a customer
curl -X POST http://localhost:3000/api/crm/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "status": "lead"
  }'

# Get all customers
curl http://localhost:3000/api/crm/customers \
  -H "Authorization: Bearer $TOKEN"

# Create a support ticket
curl -X POST http://localhost:3000/api/crm/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Need help with product",
    "description": "I need assistance...",
    "customerId": "customer-uuid-here",
    "priority": "medium",
    "category": "general"
  }'
```

## 📁 File Structure

```
src/features/crm/
├── crm.controller.ts          # All CRM endpoints
├── crm.module.ts              # Module configuration
├── domain/
│   ├── customer.entity.ts           # Customer entity
│   ├── support-ticket.entity.ts     # Support ticket entity
│   ├── ticket-comment.entity.ts     # Ticket comment entity
│   ├── customer-note.entity.ts      # Customer note entity
│   └── customer-activity.entity.ts  # Activity log entity
├── dto/
│   ├── customer.dto.ts        # Customer DTOs
│   └── ticket.dto.ts          # Ticket & note DTOs
├── repositories/
│   ├── customer.repository.ts
│   ├── support-ticket.repository.ts
│   ├── customer-note.repository.ts
│   ├── customer-activity.repository.ts
│   └── ticket-comment.repository.ts
└── services/
    └── crm.service.ts         # CRM business logic
```

## 🎯 Key Features

### Automatic Activity Logging

Every action is automatically logged:

- Customer created/updated
- Ticket created/updated/assigned
- Notes added
- Status changes
- Complete audit trail

### Smart Ticket Numbering

Auto-generated sequential ticket numbers: `TKT-000001`, `TKT-000002`, etc.

### First Response Tracking

Automatically tracks when the first response is given to a ticket.

### Rich Filtering

Filter customers and tickets by multiple criteria simultaneously.

### Metadata Support

Both tickets and customers support custom JSON metadata for extensibility.

## 🚀 Next Steps

1. **Test the endpoints** using Swagger or Postman
2. **Create customers** and manage their information
3. **Open support tickets** and track resolution
4. **Add notes** to customers for record keeping
5. **Review activities** to see complete audit trail
6. **Check statistics** for insights

## 💡 Best Practices

1. **Always assign tickets** to ensure accountability
2. **Use appropriate priorities** for proper triage
3. **Add tags** for better organization
4. **Update ticket status** as work progresses
5. **Add internal comments** for team communication
6. **Review activities** to understand customer history

## ✅ Everything Is Ready!

- ✅ Database schema auto-created
- ✅ Super admin user seeded
- ✅ All permissions configured
- ✅ Complete API documentation
- ✅ RBAC protection enabled
- ✅ Build & lint passing

Your enterprise CRM system is fully operational! 🎊
