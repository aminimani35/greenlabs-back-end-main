import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SupportTicket } from './support-ticket.entity';
import { CustomerNote } from './customer-note.entity';
import { CustomerActivity } from './customer-activity.entity';

export enum CustomerStatus {
  LEAD = 'lead',
  PROSPECT = 'prospect',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CHURNED = 'churned',
}

export enum CustomerType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise',
}

export enum CustomerPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VIP = 'vip',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  company: string;

  @Column({ length: 100, nullable: true })
  jobTitle: string;

  @Column({
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.INDIVIDUAL,
  })
  type: CustomerType;

  @Column({
    type: 'enum',
    enum: CustomerStatus,
    default: CustomerStatus.LEAD,
  })
  status: CustomerStatus;

  @Column({
    type: 'enum',
    enum: CustomerPriority,
    default: CustomerPriority.MEDIUM,
  })
  priority: CustomerPriority;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 20, nullable: true })
  zipCode: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ length: 255, nullable: true })
  linkedin: string;

  @Column({ length: 255, nullable: true })
  twitter: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  lifetime_value: number;

  @Column({ name: 'last_contact_date', nullable: true })
  lastContactDate: Date;

  @Column({ name: 'acquisition_source', length: 100, nullable: true })
  acquisitionSource: string;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: string; // User ID of assigned sales/support rep

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  custom_fields: Record<string, any>;

  @OneToMany(() => SupportTicket, (ticket) => ticket.customer)
  tickets: SupportTicket[];

  @OneToMany(() => CustomerNote, (note) => note.customer)
  customerNotes: CustomerNote[];

  @OneToMany(() => CustomerActivity, (activity) => activity.customer)
  activities: CustomerActivity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
