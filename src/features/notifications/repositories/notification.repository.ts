import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
  NotificationPriority,
} from '../domain/notification.entity';

export interface NotificationFilters {
  userId?: string;
  isRead?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
  category?: string;
  isPinned?: boolean;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  constructor(private dataSource: DataSource) {
    super(Notification, dataSource.createEntityManager());
  }

  async findByUserId(
    userId: string,
    filters: NotificationFilters = {},
  ): Promise<{ notifications: Notification[]; total: number }> {
    const {
      isRead,
      type,
      priority,
      category,
      isPinned,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = filters;

    const query = this.createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.isPinned', 'DESC')
      .addOrderBy('notification.createdAt', 'DESC');

    if (isRead !== undefined) {
      query.andWhere('notification.isRead = :isRead', { isRead });
    }

    if (type) {
      query.andWhere('notification.type = :type', { type });
    }

    if (priority) {
      query.andWhere('notification.priority = :priority', { priority });
    }

    if (category) {
      query.andWhere('notification.category = :category', { category });
    }

    if (isPinned !== undefined) {
      query.andWhere('notification.isPinned = :isPinned', { isPinned });
    }

    if (startDate) {
      query.andWhere('notification.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('notification.createdAt <= :endDate', { endDate });
    }

    // Remove expired notifications from results
    query.andWhere(
      '(notification.expiresAt IS NULL OR notification.expiresAt > :now)',
      { now: new Date() },
    );

    const total = await query.getCount();
    const notifications = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { notifications, total };
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return this.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    notification.readAt = new Date();

    return this.save(notification);
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.createQueryBuilder()
      .update(Notification)
      .set({ isRead: true, readAt: new Date() })
      .where('userId = :userId AND isRead = false', { userId })
      .execute();

    return result.affected || 0;
  }

  async markAsUnread(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = false;
    notification.readAt = null;

    return this.save(notification);
  }

  async togglePin(id: string, userId: string): Promise<Notification> {
    const notification = await this.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isPinned = !notification.isPinned;

    return this.save(notification);
  }

  async deleteByUserId(id: string, userId: string): Promise<void> {
    await this.delete({ id, userId });
  }

  async deleteAllReadByUserId(userId: string): Promise<number> {
    const result = await this.delete({
      userId,
      isRead: true,
    });

    return result.affected || 0;
  }

  async deleteExpired(): Promise<number> {
    const result = await this.createQueryBuilder()
      .delete()
      .from(Notification)
      .where('expiresAt IS NOT NULL AND expiresAt < :now', { now: new Date() })
      .execute();

    return result.affected || 0;
  }

  async getStatsByUserId(userId: string): Promise<{
    total: number;
    unread: number;
    read: number;
    pinned: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    const notifications = await this.find({
      where: { userId },
    });

    const stats = {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      read: notifications.filter((n) => n.isRead).length,
      pinned: notifications.filter((n) => n.isPinned).length,
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    };

    notifications.forEach((notification) => {
      stats.byType[notification.type] =
        (stats.byType[notification.type] || 0) + 1;
      stats.byPriority[notification.priority] =
        (stats.byPriority[notification.priority] || 0) + 1;
    });

    return stats;
  }

  async getRecentByUserId(
    userId: string,
    limit: number = 10,
  ): Promise<Notification[]> {
    return this.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
