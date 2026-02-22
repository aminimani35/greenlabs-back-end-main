import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmController } from './crm.controller';
import { CrmService } from './services/crm.service';
import { Customer } from './domain/customer.entity';
import { SupportTicket } from './domain/support-ticket.entity';
import { CustomerNote } from './domain/customer-note.entity';
import { CustomerActivity } from './domain/customer-activity.entity';
import { TicketComment } from './domain/ticket-comment.entity';
import { CustomerRepository } from './repositories/customer.repository';
import { SupportTicketRepository } from './repositories/support-ticket.repository';
import { CustomerNoteRepository } from './repositories/customer-note.repository';
import { CustomerActivityRepository } from './repositories/customer-activity.repository';
import { TicketCommentRepository } from './repositories/ticket-comment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      SupportTicket,
      CustomerNote,
      CustomerActivity,
      TicketComment,
    ]),
  ],
  controllers: [CrmController],
  providers: [
    CrmService,
    CustomerRepository,
    SupportTicketRepository,
    CustomerNoteRepository,
    CustomerActivityRepository,
    TicketCommentRepository,
  ],
  exports: [CrmService],
})
export class CrmModule {}
