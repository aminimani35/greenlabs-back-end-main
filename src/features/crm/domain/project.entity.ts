import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../crm/domain/customer.entity';
import { License } from '../../products/domain/license.entity';

export enum ProjectStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 100, unique: true, name: 'project_code' })
  projectCode: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'timestamp', name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_value' })
  totalValue: number;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @Column({ length: 255, nullable: true, name: 'managed_by' })
  managedBy: string;

  @Column({ type: 'simple-array', nullable: true, name: 'team_members' })
  teamMembers: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
