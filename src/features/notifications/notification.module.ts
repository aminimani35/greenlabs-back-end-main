import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationController } from './notification.controller';
import { NotificationService } from './services/notification.service';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationPreferenceRepository } from './repositories/notification-preference.repository';
import { Notification } from './domain/notification.entity';
import { NotificationPreference } from './domain/notification-preference.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationPreference]),
    ScheduleModule.forRoot(),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    NotificationPreferenceRepository,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
