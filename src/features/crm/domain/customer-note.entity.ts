import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum NoteType {
  GENERAL = 'general',
  MEETING = 'meeting',
  CALL = 'call',
  EMAIL = 'email',
  TASK = 'task',
  REMINDER = 'reminder',
}

@Entity('customer_notes')
export class CustomerNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.customerNotes)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: NoteType,
    default: NoteType.GENERAL,
  })
  type: NoteType;

  @Column({ name: 'created_by' })
  createdBy: string; // User ID

  @Column({ name: 'created_by_name', length: 255 })
  createdByName: string;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
