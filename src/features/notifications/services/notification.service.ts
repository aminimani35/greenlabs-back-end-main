import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationPreferenceRepository } from '../repositories/notification-preference.repository';
import {
  Notification,
  NotificationType,
  NotificationPriority,
} from '../domain/notification.entity';
import { NotificationPreference } from '../domain/notification-preference.entity';
import {
  CreateNotificationDto,
  CreateBulkNotificationDto,
  NotificationQueryDto,
  UpdateNotificationPreferenceDto,
} from '../dto/notification.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly preferenceRepository: NotificationPreferenceRepository,
  ) {}

  /**
   * Create a single notification
   */
  async createNotification(dto: CreateNotificationDto): Promise<Notification> {
    // Check if notification is muted
    const isMuted = await this.preferenceRepository.isNotificationMuted(
      dto.userId,
      dto.type || NotificationType.INFO,
      dto.category,
    );

    if (isMuted) {
      this.logger.log(
        `Notification muted for user ${dto.userId}, type: ${dto.type}`,
      );
      return null;
    }

    const notification = this.notificationRepository.create({
      ...dto,
      type: dto.type || NotificationType.INFO,
      priority: dto.priority || NotificationPriority.NORMAL,
    });

    return this.notificationRepository.save(notification);
  }

  /**
   * Create notifications for multiple users (bulk)
   */
  async createBulkNotification(
    dto: CreateBulkNotificationDto,
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const userId of dto.userIds) {
      const isMuted = await this.preferenceRepository.isNotificationMuted(
        userId,
        dto.type || NotificationType.SYSTEM,
        dto.category,
      );

      if (!isMuted) {
        const notification = this.notificationRepository.create({
          title: dto.title,
          message: dto.message,
          userId,
          type: dto.type || NotificationType.SYSTEM,
          priority: dto.priority || NotificationPriority.NORMAL,
          category: dto.category,
          metadata: dto.metadata,
        });

        notifications.push(notification);
      }
    }

    if (notifications.length > 0) {
      return this.notificationRepository.save(notifications);
    }

    return [];
  }

  /**
   * Get notifications for a user with filtering
   */
  async getUserNotifications(
    userId: string,
    query: NotificationQueryDto,
  ): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { notifications, total } =
      await this.notificationRepository.findByUserId(userId, {
        ...query,
        userId,
      });

    const limit = query.limit || 50;
    const page = query.page || 1;

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.countUnreadByUserId(userId);
  }

  /**
   * Get a single notification by ID
   */
  async getNotificationById(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string, userId: string): Promise<Notification> {
    return this.notificationRepository.markAsRead(id, userId);
  }

  /**
   * Mark notification as unread
   */
  async markAsUnread(id: string, userId: string): Promise<Notification> {
    return this.notificationRepository.markAsUnread(id, userId);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ affected: number }> {
    const affected = await this.notificationRepository.markAllAsRead(userId);
    return { affected };
  }

  /**
   * Toggle pin status
   */
  async togglePin(id: string, userId: string): Promise<Notification> {
    return this.notificationRepository.togglePin(id, userId);
  }

  /**
   * Delete a notification
   */
  async deleteNotification(id: string, userId: string): Promise<void> {
    const notification = await this.getNotificationById(id, userId);
    await this.notificationRepository.remove(notification);
  }

  /**
   * Delete all read notifications for a user
   */
  async deleteAllRead(userId: string): Promise<{ affected: number }> {
    const affected =
      await this.notificationRepository.deleteAllReadByUserId(userId);
    return { affected };
  }

  /**
   * Get notification statistics for a user
   */
  async getStatistics(userId: string): Promise<{
    total: number;
    unread: number;
    read: number;
    pinned: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    return this.notificationRepository.getStatsByUserId(userId);
  }

  /**
   * Get recent notifications
   */
  async getRecentNotifications(
    userId: string,
    limit: number = 10,
  ): Promise<Notification[]> {
    return this.notificationRepository.getRecentByUserId(userId, limit);
  }

  /**
   * Get user notification preferences
   */
  async getPreferences(userId: string): Promise<NotificationPreference> {
    return this.preferenceRepository.findByUserId(userId);
  }

  /**
   * Update user notification preferences
   */
  async updatePreferences(
    userId: string,
    dto: UpdateNotificationPreferenceDto,
  ): Promise<NotificationPreference> {
    return this.preferenceRepository.updatePreferences(userId, dto);
  }

  /**
   * Helper: Create CRM ticket assigned notification
   */
  async notifyTicketAssigned(
    userId: string,
    ticketId: string,
    ticketNumber: string,
    ticketSubject: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      title: 'New Ticket Assigned',
      message: `You have been assigned to ticket #${ticketNumber}: ${ticketSubject}`,
      type: NotificationType.CRM_TICKET_ASSIGNED,
      priority: NotificationPriority.HIGH,
      category: 'crm',
      icon: 'ticket',
      actionUrl: `/crm/tickets/${ticketId}`,
      actionLabel: 'View Ticket',
      relatedEntityId: ticketId,
      relatedEntityType: 'SupportTicket',
      metadata: { ticketNumber, ticketSubject },
    });
  }

  /**
   * Helper: Create CRM ticket updated notification
   */
  async notifyTicketUpdated(
    userId: string,
    ticketId: string,
    ticketNumber: string,
    updateType: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      title: 'Ticket Updated',
      message: `Ticket #${ticketNumber} has been ${updateType}`,
      type: NotificationType.CRM_TICKET_UPDATED,
      priority: NotificationPriority.NORMAL,
      category: 'crm',
      icon: 'ticket',
      actionUrl: `/crm/tickets/${ticketId}`,
      actionLabel: 'View Ticket',
      relatedEntityId: ticketId,
      relatedEntityType: 'SupportTicket',
      metadata: { ticketNumber, updateType },
    });
  }

  /**
   * Helper: Create CRM ticket comment notification
   */
  async notifyTicketComment(
    userId: string,
    ticketId: string,
    ticketNumber: string,
    commenterName: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      title: 'New Comment on Ticket',
      message: `${commenterName} added a comment to ticket #${ticketNumber}`,
      type: NotificationType.CRM_COMMENT_ADDED,
      priority: NotificationPriority.NORMAL,
      category: 'crm',
      icon: 'comment',
      actionUrl: `/crm/tickets/${ticketId}`,
      actionLabel: 'View Ticket',
      relatedEntityId: ticketId,
      relatedEntityType: 'SupportTicket',
      metadata: { ticketNumber, commenterName },
    });
  }

  /**
   * Helper: Create CRM customer created notification
   */
  async notifyCustomerCreated(
    userId: string,
    customerId: string,
    customerName: string,
  ): Promise<Notification> {
    return this.createNotification({
      userId,
      title: 'New Customer Created',
      message: `A new customer "${customerName}" has been added to the system`,
      type: NotificationType.CRM_CUSTOMER_CREATED,
      priority: NotificationPriority.NORMAL,
      category: 'crm',
      icon: 'user',
      actionUrl: `/crm/customers/${customerId}`,
      actionLabel: 'View Customer',
      relatedEntityId: customerId,
      relatedEntityType: 'Customer',
      metadata: { customerName },
    });
  }

  /**
   * Cron job: Clean up expired notifications daily
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupExpiredNotifications(): Promise<void> {
    const deleted = await this.notificationRepository.deleteExpired();
    this.logger.log(`Cleaned up ${deleted} expired notifications`);
  }
}
