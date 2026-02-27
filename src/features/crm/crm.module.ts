import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmController } from './crm.controller';
import { ProjectController } from './controllers/project.controller';
import { CrmService } from './services/crm.service';
import { ProjectService } from './services/project.service';
import { Customer } from './domain/customer.entity';
import { SupportTicket } from './domain/support-ticket.entity';
import { CustomerNote } from './domain/customer-note.entity';
import { CustomerActivity } from './domain/customer-activity.entity';
import { TicketComment } from './domain/ticket-comment.entity';
import { Project } from './domain/project.entity';
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
      Project,
    ]),
  ],
  controllers: [CrmController, ProjectController],
  providers: [
    CrmService,
    ProjectService,
    CustomerRepository,
    SupportTicketRepository,
    CustomerNoteRepository,
    CustomerActivityRepository,
    TicketCommentRepository,
  ],
  exports: [CrmService, ProjectService],
})
export class CrmModule {}
