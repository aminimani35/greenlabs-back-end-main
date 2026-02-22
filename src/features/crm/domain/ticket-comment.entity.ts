import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupportTicket } from './support-ticket.entity';

export enum CommentType {
  CUSTOMER = 'customer',
  AGENT = 'agent',
  INTERNAL = 'internal',
  SYSTEM = 'system',
}

@Entity('ticket_comments')
export class TicketComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ticket_id' })
  ticketId: string;

  @ManyToOne(() => SupportTicket, (ticket) => ticket.comments)
  @JoinColumn({ name: 'ticket_id' })
  ticket: SupportTicket;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: CommentType,
    default: CommentType.AGENT,
  })
  type: CommentType;

  @Column({ name: 'created_by' })
  createdBy: string; // User ID

  @Column({ name: 'created_by_name', length: 255 })
  createdByName: string;

  @Column({ name: 'is_internal', default: false })
  isInternal: boolean;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
