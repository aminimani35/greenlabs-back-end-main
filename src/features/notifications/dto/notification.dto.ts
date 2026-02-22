import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsObject,
  IsDateString,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationType,
  NotificationPriority,
} from '../domain/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ example: 'New Support Ticket Assigned' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'You have been assigned to ticket #TKT-000123',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    enum: NotificationType,
    example: NotificationType.CRM_TICKET_ASSIGNED,
  })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiPropertyOptional({
    enum: NotificationPriority,
    example: NotificationPriority.NORMAL,
  })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @ApiProperty({ example: 'user-uuid-here' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ example: '/crm/tickets/123' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  actionUrl?: string;

  @ApiPropertyOptional({ example: 'View Ticket' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  actionLabel?: string;

  @ApiPropertyOptional({ example: 'ticket' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  icon?: string;

  @ApiPropertyOptional({ example: 'support' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({ example: 'ticket-uuid' })
  @IsUUID()
  @IsOptional()
  relatedEntityId?: string;

  @ApiPropertyOptional({ example: 'SupportTicket' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  relatedEntityType?: string;

  @ApiPropertyOptional({ example: { ticketNumber: 'TKT-000123' } })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  expiresAt?: Date;
}

export class CreateBulkNotificationDto {
  @ApiProperty({ example: 'System Maintenance Notice' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'System will be down for maintenance tonight',
  })
  @IsString()
  message: string;

  @ApiProperty({
    type: [String],
    example: ['user-uuid-1', 'user-uuid-2'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];

  @ApiPropertyOptional({
    enum: NotificationType,
    example: NotificationType.SYSTEM,
  })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiPropertyOptional({
    enum: NotificationPriority,
    example: NotificationPriority.HIGH,
  })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class NotificationQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 50, default: 50 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 50;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiPropertyOptional({ enum: NotificationType })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiPropertyOptional({ enum: NotificationPriority })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @ApiPropertyOptional({ example: 'support' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;
}

export class UpdateNotificationPreferenceDto {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  emailOnTicketAssigned?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  emailOnTicketUpdated?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  emailOnMention?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  emailDigest?: boolean;

  @ApiPropertyOptional({ example: 'daily' })
  @IsString()
  @IsOptional()
  emailDigestFrequency?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  pushOnTicketAssigned?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  pushOnMention?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  inAppEnabled?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  showDesktopNotifications?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  playSounds?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  doNotDisturb?: boolean;

  @ApiPropertyOptional({ example: '22:00' })
  @IsString()
  @IsOptional()
  dndStartTime?: string;

  @ApiPropertyOptional({ example: '08:00' })
  @IsString()
  @IsOptional()
  dndEndTime?: string;

  @ApiPropertyOptional({ type: [String], example: ['marketing'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mutedCategories?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['crm_ticket_updated'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mutedTypes?: string[];
}
