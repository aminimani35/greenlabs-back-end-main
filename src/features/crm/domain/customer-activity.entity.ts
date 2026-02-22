import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum ActivityType {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  NOTE_ADDED = 'note_added',
  TICKET_CREATED = 'ticket_created',
  TICKET_UPDATED = 'ticket_updated',
  EMAIL_SENT = 'email_sent',
  CALL_MADE = 'call_made',
  MEETING_SCHEDULED = 'meeting_scheduled',
  ASSIGNED = 'assigned',
  TAG_ADDED = 'tag_added',
  TAG_REMOVED = 'tag_removed',
}

@Entity('customer_activities')
export class CustomerActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.activities)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column({ length: 500 })
  description: string;

  @Column({ name: 'performed_by', nullable: true })
  performedBy: string; // User ID

  @Column({ name: 'performed_by_name', length: 255, nullable: true })
  performedByName: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
