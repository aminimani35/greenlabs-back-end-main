import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';

export enum NotificationType {
  SYSTEM = 'system',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  CRM_TICKET_CREATED = 'crm_ticket_created',
  CRM_TICKET_ASSIGNED = 'crm_ticket_assigned',
  CRM_TICKET_UPDATED = 'crm_ticket_updated',
  CRM_TICKET_RESOLVED = 'crm_ticket_resolved',
  CRM_TICKET_CLOSED = 'crm_ticket_closed',
  CRM_COMMENT_ADDED = 'crm_comment_added',
  CRM_CUSTOMER_CREATED = 'crm_customer_created',
  USER_MENTIONED = 'user_mentioned',
  CUSTOM = 'custom',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('notifications')
@Index(['userId', 'isRead'])
@Index(['userId', 'createdAt'])
@Index(['type'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  actionUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  actionLabel: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string;

  @Column({ type: 'uuid', nullable: true })
  relatedEntityId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  relatedEntityType: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isPinned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
