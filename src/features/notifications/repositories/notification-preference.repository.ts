import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotificationPreference } from '../domain/notification-preference.entity';

@Injectable()
export class NotificationPreferenceRepository extends Repository<NotificationPreference> {
  constructor(private dataSource: DataSource) {
    super(NotificationPreference, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<NotificationPreference> {
    let preference = await this.findOne({
      where: { userId },
    });

    // Create default preferences if not exists
    if (!preference) {
      preference = this.create({
        userId,
        emailEnabled: true,
        emailOnTicketAssigned: true,
        emailOnTicketUpdated: true,
        emailOnMention: true,
        emailDigest: false,
        emailDigestFrequency: 'daily',
        pushEnabled: true,
        pushOnTicketAssigned: true,
        pushOnMention: true,
        inAppEnabled: true,
        showDesktopNotifications: true,
        playSounds: true,
        doNotDisturb: false,
        mutedCategories: [],
        mutedTypes: [],
      });
      preference = await this.save(preference);
    }

    return preference;
  }

  async updatePreferences(
    userId: string,
    updates: Partial<NotificationPreference>,
  ): Promise<NotificationPreference> {
    const preference = await this.findByUserId(userId);
    Object.assign(preference, updates);
    return this.save(preference);
  }

  async isNotificationMuted(
    userId: string,
    type: string,
    category?: string,
  ): Promise<boolean> {
    const preference = await this.findByUserId(userId);

    if (!preference.inAppEnabled) {
      return true;
    }

    if (preference.doNotDisturb) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      if (
        preference.dndStartTime &&
        preference.dndEndTime &&
        currentTime >= preference.dndStartTime &&
        currentTime <= preference.dndEndTime
      ) {
        return true;
      }
    }

    if (preference.mutedTypes?.includes(type)) {
      return true;
    }

    if (category && preference.mutedCategories?.includes(category)) {
      return true;
    }

    return false;
  }
}
