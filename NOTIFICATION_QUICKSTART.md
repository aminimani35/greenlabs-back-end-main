# Notification Module - Quick Reference

## 🚀 Quick Start

### Get Unread Count

```bash
GET /api/notifications/unread/count
```

### Get Recent Notifications

```bash
GET /api/notifications/recent?limit=10
```

### Mark All as Read

```bash
PATCH /api/notifications/read-all
```

## 📋 Common Notification Types

### CRM Events

- `crm_ticket_assigned` - New ticket assigned
- `crm_ticket_updated` - Ticket status changed
- `crm_comment_added` - New comment added
- `crm_customer_created` - New customer

### General

- `system` - System announcements
- `info` - Informational
- `success` - Success messages
- `warning` - Warnings
- `error` - Error alerts

## 🎯 Helper Methods

### Notify Ticket Assigned

```typescript
await notificationService.notifyTicketAssigned(
  userId,
  ticketId,
  'TKT-000123',
  'Cannot login',
);
```

### Notify Ticket Update

```typescript
await notificationService.notifyTicketUpdated(
  userId,
  ticketId,
  'TKT-000123',
  'resolved',
);
```

### Notify Comment Added

```typescript
await notificationService.notifyTicketComment(
  userId,
  ticketId,
  'TKT-000123',
  'John Doe',
);
```

### Custom Notification

```typescript
await notificationService.createNotification({
  userId: 'user-uuid',
  title: 'Order Shipped',
  message: 'Your order #12345 has shipped',
  type: NotificationType.SUCCESS,
  priority: NotificationPriority.NORMAL,
  category: 'orders',
  actionUrl: '/orders/12345',
  actionLabel: 'Track Order',
  metadata: { orderNumber: '12345' },
});
```

## 🔐 Permissions

- `notification:create` - Create notifications (admin/editor)
- `notification:read` - Read own notifications
- `notification:update` - Update notification status
- `notification:delete` - Delete own notifications

## 📊 Useful Endpoints

| Endpoint                          | Method | Description                          |
| --------------------------------- | ------ | ------------------------------------ |
| `/api/notifications`              | GET    | Get all notifications (with filters) |
| `/api/notifications/unread/count` | GET    | Get unread count                     |
| `/api/notifications/recent`       | GET    | Get recent notifications             |
| `/api/notifications/statistics`   | GET    | Get stats                            |
| `/api/notifications/:id/read`     | PATCH  | Mark as read                         |
| `/api/notifications/read-all`     | PATCH  | Mark all as read                     |
| `/api/notifications/:id/pin`      | PATCH  | Toggle pin                           |
| `/api/notifications/:id`          | DELETE | Delete one                           |
| `/api/notifications/read/all`     | DELETE | Delete all read                      |
| `/api/notifications/preferences`  | GET    | Get user preferences                 |
| `/api/notifications/preferences`  | PATCH  | Update preferences                   |

## 🎨 Filter Parameters

```bash
GET /api/notifications?isRead=false&type=crm_ticket_assigned&priority=high&page=1&limit=20
```

- `isRead` - true/false
- `type` - Notification type
- `priority` - low/normal/high/urgent
- `category` - Category name
- `isPinned` - true/false
- `page` - Page number
- `limit` - Items per page (max 100)

## 💡 Do Not Disturb

```typescript
// Update preferences
PATCH /api/notifications/preferences
{
  "doNotDisturb": true,
  "dndStartTime": "22:00",  // 10 PM
  "dndEndTime": "08:00"      // 8 AM
}
```

## 🔕 Muting

```typescript
// Mute specific types and categories
{
  "mutedTypes": ["info", "crm_ticket_updated"],
  "mutedCategories": ["marketing"]
}
```

## ⏰ Expiring Notifications

```typescript
{
  "title": "Flash Sale!",
  "message": "50% off today only",
  "expiresAt": "2026-02-23T23:59:59Z"
}
// Auto-deleted by cron job at 2 AM daily
```

## 📱 Frontend Example

```typescript
// Get unread count
const { count } = await fetch('/api/notifications/unread/count').then((r) =>
  r.json(),
);

// Get notifications
const { notifications, total } = await fetch(
  '/api/notifications?isRead=false&limit=10',
).then((r) => r.json());

// Mark as read
await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });

// Mark all as read
await fetch('/api/notifications/read-all', { method: 'PATCH' });
```

## 📦 Priority Levels

- `low` - Can wait
- `normal` - Standard (default)
- `high` - Important
- `urgent` - Critical, immediate attention

## 🎯 Best Use Cases

1. **Ticket Assignment** - Notify agents when tickets are assigned
2. **Status Updates** - Alert users when ticket status changes
3. **System Alerts** - Broadcast important system messages
4. **Activity Tracking** - Inform users about important events
5. **Reminders** - Send time-sensitive reminders with expiration

## 🔧 Bulk Notifications

Send to multiple users at once:

```typescript
POST /api/notifications/bulk
{
  "title": "Maintenance Window",
  "message": "System will be down 2-4 AM",
  "userIds": ["uuid1", "uuid2", "uuid3"],
  "type": "system",
  "priority": "high"
}
```

## ✨ Pro Tips

- Use **high priority** for urgent matters only
- Include **actionUrl** for better UX
- Set **expiresAt** for time-sensitive notifications
- Enable **emailDigest** to reduce email overload
- **Pin** critical notifications for visibility
- Use **metadata** for rich client-side rendering
- Leverage **categories** for organization
- Configure **DND** for uninterrupted focus time

---

For complete documentation, see [NOTIFICATION_GUIDE.md](NOTIFICATION_GUIDE.md)
