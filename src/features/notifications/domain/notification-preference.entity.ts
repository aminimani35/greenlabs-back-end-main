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

@Entity('notification_preferences')
@Index(['userId'], { unique: true })
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Email notification settings
  @Column({ type: 'boolean', default: true })
  emailEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  emailOnTicketAssigned: boolean;

  @Column({ type: 'boolean', default: true })
  emailOnTicketUpdated: boolean;

  @Column({ type: 'boolean', default: true })
  emailOnMention: boolean;

  @Column({ type: 'boolean', default: false })
  emailDigest: boolean;

  @Column({ type: 'varchar', length: 50, default: 'daily' })
  emailDigestFrequency: string; // 'daily', 'weekly', 'never'

  // Push notification settings
  @Column({ type: 'boolean', default: true })
  pushEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  pushOnTicketAssigned: boolean;

  @Column({ type: 'boolean', default: true })
  pushOnMention: boolean;

  // In-app notification settings
  @Column({ type: 'boolean', default: true })
  inAppEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  showDesktopNotifications: boolean;

  @Column({ type: 'boolean', default: true })
  playSounds: boolean;

  // Do Not Disturb
  @Column({ type: 'boolean', default: false })
  doNotDisturb: boolean;

  @Column({ type: 'time', nullable: true })
  dndStartTime: string;

  @Column({ type: 'time', nullable: true })
  dndEndTime: string;

  // Category preferences
  @Column({ type: 'jsonb', nullable: true })
  mutedCategories: string[];

  @Column({ type: 'jsonb', nullable: true })
  mutedTypes: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
