# Notification Module - In-App Notifications

## 🎉 Overview

A comprehensive enterprise notification system for in-app notifications with user preferences, smart filtering, and automatic cleanup. Perfect for keeping users informed about important events, tickets, and system updates.

## ✅ Features Implemented

### Notification Management

- ✅ Create single or bulk notifications
- ✅ Rich notification types (System, Info, Success, Warning, Error, CRM events, Custom)
- ✅ Priority levels (Low, Normal, High, Urgent)
- ✅ Read/unread tracking with timestamps
- ✅ Pin important notifications
- ✅ Action buttons with URLs and labels
- ✅ Custom icons and categories
- ✅ Metadata support for extensibility
- ✅ Expiration dates for time-sensitive notifications
- ✅ Related entity tracking (link notifications to tickets, customers, etc.)
- ✅ Automatic cleanup of expired notifications via cron job

### User Preferences

- ✅ Per-user notification settings
- ✅ Email notification preferences
- ✅ Push notification settings
- ✅ In-app notification toggles
- ✅ Do Not Disturb mode with time ranges
- ✅ Mute specific notification types or categories
- ✅ Desktop notification preferences
- ✅ Sound preferences
- ✅ Email digest configuration (daily/weekly)

### Advanced Features

- ✅ Advanced filtering (type, priority, read status, category, pinned)
- ✅ Pagination support
- ✅ Search and filtering
- ✅ Statistics and analytics
- ✅ Recent notifications widget
- ✅ Bulk operations (mark all as read, delete all read)
- ✅ Role-based access control
- ✅ Complete API documentation via Swagger

### CRM Integration Helpers

- ✅ Auto-notify on ticket assignment
- ✅ Auto-notify on ticket updates
- ✅ Auto-notify on new comments
- ✅ Auto-notify on customer creation
- ✅ Smart notification delivery based on user preferences

## 📚 Database Schema

### Entities

1. **Notification** - Individual notification records
   - Basic info: title, message, type, priority
   - User relationship
   - Read tracking (isRead, readAt)
   - Action data (actionUrl, actionLabel, icon)
   - Categorization (category, tags)
   - Related entity tracking
   - Expiration support
   - Pin functionality
   - Metadata field for custom data

2. **NotificationPreference** - User notification settings
   - Email settings (enabled, triggers, digest)
   - Push settings
   - In-app settings
   - Do Not Disturb configuration
   - Muted types and categories

## 🚀 API Endpoints

### Notification Endpoints

#### Create Single Notification

```http
POST /api/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Support Ticket Assigned",
  "message": "You have been assigned to ticket #TKT-000123",
  "userId": "user-uuid",
  "type": "crm_ticket_assigned",
  "priority": "high",
  "category": "support",
  "icon": "ticket",
  "actionUrl": "/crm/tickets/123",
  "actionLabel": "View Ticket",
  "relatedEntityId": "ticket-uuid",
  "relatedEntityType": "SupportTicket",
  "metadata": {
    "ticketNumber": "TKT-000123"
  }
}
```

**Required Permissions:** `notification:create`
**Required Roles:** `admin`, `editor`

#### Create Bulk Notification

```http
POST /api/notifications/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "System Maintenance Notice",
  "message": "The system will be down for maintenance from 2 AM to 4 AM",
  "userIds": ["user-uuid-1", "user-uuid-2", "user-uuid-3"],
  "type": "system",
  "priority": "high",
  "category": "system"
}
```

**Required Permissions:** `notification:create`
**Required Roles:** `admin`

#### Get User Notifications

```http
GET /api/notifications?page=1&limit=50&isRead=false&priority=high
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50, max: 100)
- `isRead` - Filter by read status (true/false)
- `type` - Filter by notification type
- `priority` - Filter by priority level
- `category` - Filter by category
- `isPinned` - Filter by pinned status (true/false)

**Response:**

```json
{
  "notifications": [...],
  "total": 125,
  "page": 1,
  "limit": 50,
  "totalPages": 3
}
```

**Required Permissions:** `notification:read`

#### Get Unread Count

```http
GET /api/notifications/unread/count
Authorization: Bearer <token>
```

**Response:**

```json
{
  "count": 15
}
```

**Required Permissions:** `notification:read`

#### Get Recent Notifications

```http
GET /api/notifications/recent?limit=10
Authorization: Bearer <token>
```

**Required Permissions:** `notification:read`

#### Get Notification Statistics

```http
GET /api/notifications/statistics
Authorization: Bearer <token>
```

**Response:**

```json
{
  "total": 250,
  "unread": 35,
  "read": 215,
  "pinned": 5,
  "byType": {
    "info": 100,
    "crm_ticket_assigned": 50,
    "system": 25,
    "success": 75
  },
  "byPriority": {
    "low": 50,
    "normal": 150,
    "high": 40,
    "urgent": 10
  }
}
```

**Required Permissions:** `notification:read`

#### Get Single Notification

```http
GET /api/notifications/:id
Authorization: Bearer <token>
```

**Required Permissions:** `notification:read`

#### Mark as Read

```http
PATCH /api/notifications/:id/read
Authorization: Bearer <token>
```

**Required Permissions:** `notification:update`

#### Mark as Unread

```http
PATCH /api/notifications/:id/unread
Authorization: Bearer <token>
```

**Required Permissions:** `notification:update`

#### Mark All as Read

```http
PATCH /api/notifications/read-all
Authorization: Bearer <token>
```

**Response:**

```json
{
  "affected": 35
}
```

**Required Permissions:** `notification:update`

#### Toggle Pin

```http
PATCH /api/notifications/:id/pin
Authorization: Bearer <token>
```

**Required Permissions:** `notification:update`

#### Delete Notification

```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

**Required Permissions:** `notification:delete`

#### Delete All Read Notifications

```http
DELETE /api/notifications/read/all
Authorization: Bearer <token>
```

**Response:**

```json
{
  "affected": 150
}
```

**Required Permissions:** `notification:delete`

### Preferences Endpoints

#### Get User Preferences

```http
GET /api/notifications/preferences
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "pref-uuid",
  "userId": "user-uuid",
  "emailEnabled": true,
  "emailOnTicketAssigned": true,
  "emailOnTicketUpdated": true,
  "emailOnMention": true,
  "emailDigest": false,
  "emailDigestFrequency": "daily",
  "pushEnabled": true,
  "pushOnTicketAssigned": true,
  "pushOnMention": true,
  "inAppEnabled": true,
  "showDesktopNotifications": true,
  "playSounds": true,
  "doNotDisturb": false,
  "dndStartTime": null,
  "dndEndTime": null,
  "mutedCategories": [],
  "mutedTypes": []
}
```

**Required Permissions:** `notification:read`

#### Update Preferences

```http
PATCH /api/notifications/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "doNotDisturb": true,
  "dndStartTime": "22:00",
  "dndEndTime": "08:00",
  "emailDigest": true,
  "emailDigestFrequency": "weekly",
  "mutedCategories": ["marketing"],
  "mutedTypes": ["info"]
}
```

**Required Permissions:** `notification:update`

## 🔐 Permissions

All notification permissions are automatically seeded:

- `notification:create` - Create notifications (admin, editor only)
- `notification:read` - Read own notifications (all authenticated users)
- `notification:update` - Update notification status (all authenticated users)
- `notification:delete` - Delete own notifications (all authenticated users)

## 📊 Notification Types

### System Types

- `system` - System-wide announcements
- `info` - Informational messages
- `success` - Success confirmations
- `warning` - Warning messages
- `error` - Error notifications

### CRM Types

- `crm_ticket_created` - New ticket created
- `crm_ticket_assigned` - Ticket assigned to you
- `crm_ticket_updated` - Ticket status/details updated
- `crm_ticket_resolved` - Ticket marked as resolved
- `crm_ticket_closed` - Ticket closed
- `crm_comment_added` - New comment on ticket
- `crm_customer_created` - New customer added

### Other Types

- `user_mentioned` - You were mentioned
- `custom` - Custom notification type

## 🎯 Priority Levels

- `low` - Non-urgent, can be addressed later
- `normal` - Standard priority (default)
- `high` - Important, needs attention soon
- `urgent` - Critical, requires immediate attention

## 💡 Service Helper Methods

The `NotificationService` provides convenient helper methods for common scenarios:

### CRM Helpers

```typescript
// Notify user about ticket assignment
await notificationService.notifyTicketAssigned(
  userId,
  ticketId,
  'TKT-000123',
  'Cannot login to system',
);

// Notify about ticket update
await notificationService.notifyTicketUpdated(
  userId,
  ticketId,
  'TKT-000123',
  'resolved',
);

// Notify about new comment
await notificationService.notifyTicketComment(
  userId,
  ticketId,
  'TKT-000123',
  'John Doe',
);

// Notify about new customer
await notificationService.notifyCustomerCreated(
  userId,
  customerId,
  'Acme Corporation',
);
```

## 🔧 User Preference System

### Do Not Disturb (DND)

When DND is enabled with time ranges, notifications during that period are automatically muted.

```typescript
// User settings
{
  "doNotDisturb": true,
  "dndStartTime": "22:00",  // 10 PM
  "dndEndTime": "08:00"      // 8 AM
}

// Notifications sent between 10 PM and 8 AM will be muted
```

### Muting Types and Categories

Users can mute specific notification types or entire categories:

```typescript
{
  "mutedTypes": ["info", "crm_ticket_updated"],
  "mutedCategories": ["marketing", "social"]
}
```

### Email Digest

Users can opt for email digests instead of individual emails:

```typescript
{
  "emailDigest": true,
  "emailDigestFrequency": "daily"  // or "weekly"
}
```

## 🕒 Automatic Cleanup

A cron job runs daily at 2 AM to delete expired notifications:

```typescript
@Cron(CronExpression.EVERY_DAY_AT_2AM)
async cleanupExpiredNotifications() {
  // Automatically removes notifications with expiresAt < now
}
```

To create an expiring notification:

```typescript
{
  "title": "Flash Sale!",
  "message": "50% off for the next 24 hours",
  "expiresAt": "2026-02-23T23:59:59Z"
}
```

## 🎨 Usage Examples

### Using Swagger UI

1. Navigate to: `http://localhost:3000/api/docs`
2. Login and get JWT token
3. Click **Authorize** and enter: `Bearer <your-token>`
4. Test endpoints under **Notifications** section

### Using curl

```bash
# Login and get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aminimani95@proton.me","password":"Ar@d1260621"}' \
  | jq -r '.access_token')

# Get unread count
curl http://localhost:3000/api/notifications/unread/count \
  -H "Authorization: Bearer $TOKEN"

# Get all unread notifications
curl "http://localhost:3000/api/notifications?isRead=false&page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# Mark notification as read
curl -X PATCH http://localhost:3000/api/notifications/{id}/read \
  -H "Authorization: Bearer $TOKEN"

# Mark all as read
curl -X PATCH http://localhost:3000/api/notifications/read-all \
  -H "Authorization: Bearer $TOKEN"

# Get statistics
curl http://localhost:3000/api/notifications/statistics \
  -H "Authorization: Bearer $TOKEN"

# Update preferences
curl -X PATCH http://localhost:3000/api/notifications/preferences \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doNotDisturb": true,
    "dndStartTime": "22:00",
    "dndEndTime": "08:00"
  }'
```

### Frontend Integration Example

```typescript
// React/Vue component example
const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Get unread count
    fetch('/api/notifications/unread/count', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setCount(data.count));

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const response = await fetch(
      '/api/notifications?isRead=false&limit=10',
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();
    setNotifications(data.notifications);
    setCount(data.total);
  };

  const markAsRead = async (id) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchNotifications();
  };

  return (
    <div>
      <Badge count={count}>
        <BellIcon />
      </Badge>
      <NotificationList
        notifications={notifications}
        onRead={markAsRead}
      />
    </div>
  );
};
```

## 📁 File Structure

```
src/features/notifications/
├── notification.controller.ts          # REST API endpoints
├── notification.module.ts              # Module configuration
├── domain/
│   ├── notification.entity.ts          # Notification entity
│   └── notification-preference.entity.ts # User preferences entity
├── dto/
│   └── notification.dto.ts             # DTOs for API
├── repositories/
│   ├── notification.repository.ts      # Notification data access
│   └── notification-preference.repository.ts # Preferences data access
└── services/
    └── notification.service.ts         # Business logic
```

## 🎯 Best Practices

### For Developers

1. **Always check preferences** - The service automatically checks if notifications are muted
2. **Use helper methods** - Leverage `notifyTicketAssigned()` etc. for common scenarios
3. **Set appropriate priorities** - Use `urgent` sparingly, reserve for critical issues
4. **Include action URLs** - Make notifications actionable with links
5. **Add metadata** - Store additional context for richer notifications
6. **Set expiration dates** - For time-sensitive notifications (sales, events)

### For Users

1. **Configure preferences** - Set up DND times for uninterrupted work
2. **Mute categories** - Reduce noise by muting non-essential categories
3. **Pin important items** - Keep critical notifications visible
4. **Use bulk operations** - Regularly clear read notifications
5. **Enable email digest** - Get summaries instead of individual emails

## 🚀 Integration with CRM

The notification system is designed to work seamlessly with the CRM module. Here's how to integrate:

### In CRM Service

```typescript
import { NotificationService } from '../notifications/services/notification.service';

export class CrmService {
  constructor(private notificationService: NotificationService) {}

  async assignTicket(ticketId: string, userId: string) {
    // ... assign ticket logic ...

    // Send notification
    await this.notificationService.notifyTicketAssigned(
      userId,
      ticket.id,
      ticket.ticketNumber,
      ticket.subject,
    );
  }
}
```

### Custom Notifications

```typescript
// Create custom notification for any event
await notificationService.createNotification({
  userId: user.id,
  title: 'Order Shipped',
  message: `Your order #12345 has been shipped`,
  type: NotificationType.SUCCESS,
  priority: NotificationPriority.NORMAL,
  category: 'orders',
  icon: 'shipping',
  actionUrl: '/orders/12345',
  actionLabel: 'Track Order',
  relatedEntityId: orderId,
  relatedEntityType: 'Order',
  metadata: { orderNumber: '12345', carrier: 'FedEx' },
});
```

## 📊 Database Indexes

Optimized for performance with strategic indexes:

- `notifications`: userId + isRead (filtering unread)
- `notifications`: userId + createdAt (chronological retrieval)
- `notifications`: type (filtering by type)
- `notification_preferences`: userId (unique, fast lookups)

## ✅ Everything Is Ready!

- ✅ Database schema auto-created
- ✅ Notification permissions seeded
- ✅ User preferences auto-initialized
- ✅ Cron job for cleanup configured
- ✅ CRM integration helpers ready
- ✅ Complete API documentation
- ✅ RBAC protection enabled
- ✅ Build & lint passing

Your enterprise notification system is fully operational! 🎊

## 🔮 Future Enhancements

Potential additions for even more power:

- WebSocket/SSE for real-time push
- Browser push notifications
- SMS notifications
- Email sending integration
- Notification templates
- Notification history archive
- Analytics dashboard
- User notification channels (Slack, Teams, Discord)
- Notification scheduling
- A/B testing for notification content
