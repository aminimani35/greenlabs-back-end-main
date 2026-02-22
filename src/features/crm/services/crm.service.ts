import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';
import { SupportTicketRepository } from '../repositories/support-ticket.repository';
import { CustomerNoteRepository } from '../repositories/customer-note.repository';
import { CustomerActivityRepository } from '../repositories/customer-activity.repository';
import { TicketCommentRepository } from '../repositories/ticket-comment.repository';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';
import {
  CreateTicketDto,
  UpdateTicketDto,
  AssignTicketDto,
  AddCommentDto,
  CreateNoteDto,
} from '../dto/ticket.dto';
import { Customer } from '../domain/customer.entity';
import { SupportTicket, TicketStatus } from '../domain/support-ticket.entity';
import { CustomerNote } from '../domain/customer-note.entity';
import { TicketComment, CommentType } from '../domain/ticket-comment.entity';
import { ActivityType } from '../domain/customer-activity.entity';

@Injectable()
export class CrmService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly ticketRepository: SupportTicketRepository,
    private readonly noteRepository: CustomerNoteRepository,
    private readonly activityRepository: CustomerActivityRepository,
    private readonly commentRepository: TicketCommentRepository,
  ) {}

  // Customer Operations
  async createCustomer(
    dto: CreateCustomerDto,
    createdBy: string,
    createdByName: string,
  ): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findByEmail(
      dto.email,
    );
    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }

    const customer = await this.customerRepository.create(dto);

    await this.activityRepository.logActivity(
      customer.id,
      ActivityType.CREATED,
      `Customer created by ${createdByName}`,
      createdBy,
      createdByName,
    );

    return customer;
  }

  async getCustomers(filters?: any) {
    return this.customerRepository.findAll(filters);
  }

  async getCustomer(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async updateCustomer(
    id: string,
    dto: UpdateCustomerDto,
    updatedBy: string,
    updatedByName: string,
  ): Promise<Customer> {
    await this.getCustomer(id); // Verify customer exists
    const updated = await this.customerRepository.update(id, dto);

    await this.activityRepository.logActivity(
      id,
      ActivityType.UPDATED,
      `Customer updated by ${updatedByName}`,
      updatedBy,
      updatedByName,
      { changes: dto },
    );

    return updated;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.getCustomer(id);
    await this.customerRepository.delete(id);
  }

  async getCustomerActivities(customerId: string, limit = 50) {
    await this.getCustomer(customerId);
    return this.activityRepository.findByCustomerId(customerId, limit);
  }

  async getCustomerStatistics() {
    return this.customerRepository.getStatistics();
  }

  // Support Ticket Operations
  async createTicket(
    dto: CreateTicketDto,
    createdBy: string,
    createdByName: string,
  ): Promise<SupportTicket> {
    const customer = await this.getCustomer(dto.customerId);

    const ticketNumber = await this.ticketRepository.generateTicketNumber();

    const ticket = await this.ticketRepository.create({
      ...dto,
      ticketNumber,
      createdBy,
    });

    await this.activityRepository.logActivity(
      customer.id,
      ActivityType.TICKET_CREATED,
      `Support ticket ${ticketNumber} created`,
      createdBy,
      createdByName,
      { ticketId: ticket.id, ticketNumber },
    );

    return ticket;
  }

  async getTickets(filters?: any) {
    return this.ticketRepository.findAll(filters);
  }

  async getTicket(id: string): Promise<SupportTicket> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundException('Support ticket not found');
    }
    return ticket;
  }

  async updateTicket(
    id: string,
    dto: UpdateTicketDto,
    updatedBy: string,
    updatedByName: string,
  ): Promise<SupportTicket> {
    const ticket = await this.getTicket(id);
    const updated = await this.ticketRepository.update(id, dto);

    await this.activityRepository.logActivity(
      ticket.customerId,
      ActivityType.TICKET_UPDATED,
      `Ticket ${ticket.ticketNumber} updated by ${updatedByName}`,
      updatedBy,
      updatedByName,
      { ticketId: id, changes: dto },
    );

    return updated;
  }

  async assignTicket(
    id: string,
    dto: AssignTicketDto,
    assignedBy: string,
    assignedByName: string,
  ): Promise<SupportTicket> {
    const ticket = await this.getTicket(id);

    const updated = await this.ticketRepository.update(id, {
      assignedTo: dto.assignedTo,
      assignedAgentName: dto.assignedAgentName,
    });

    await this.activityRepository.logActivity(
      ticket.customerId,
      ActivityType.ASSIGNED,
      `Ticket ${ticket.ticketNumber} assigned to ${dto.assignedAgentName}`,
      assignedBy,
      assignedByName,
      { ticketId: id, assignedTo: dto.assignedTo },
    );

    return updated;
  }

  async closeTicket(
    id: string,
    closedBy: string,
    closedByName: string,
  ): Promise<SupportTicket> {
    const ticket = await this.getTicket(id);

    const updated = await this.ticketRepository.update(id, {
      status: TicketStatus.CLOSED,
      closedAt: new Date(),
    });

    await this.activityRepository.logActivity(
      ticket.customerId,
      ActivityType.TICKET_UPDATED,
      `Ticket ${ticket.ticketNumber} closed by ${closedByName}`,
      closedBy,
      closedByName,
      { ticketId: id, status: TicketStatus.CLOSED },
    );

    return updated;
  }

  async resolveTicket(
    id: string,
    resolvedBy: string,
    resolvedByName: string,
  ): Promise<SupportTicket> {
    const ticket = await this.getTicket(id);

    const updated = await this.ticketRepository.update(id, {
      status: TicketStatus.RESOLVED,
      resolvedAt: new Date(),
    });

    await this.activityRepository.logActivity(
      ticket.customerId,
      ActivityType.TICKET_UPDATED,
      `Ticket ${ticket.ticketNumber} resolved by ${resolvedByName}`,
      resolvedBy,
      resolvedByName,
      { ticketId: id, status: TicketStatus.RESOLVED },
    );

    return updated;
  }

  async deleteTicket(id: string): Promise<void> {
    await this.getTicket(id);
    await this.ticketRepository.delete(id);
  }

  async getTicketStatistics() {
    return this.ticketRepository.getStatistics();
  }

  // Comment Operations
  async addComment(
    ticketId: string,
    dto: AddCommentDto,
    userId: string,
    userName: string,
  ): Promise<TicketComment> {
    const ticket = await this.getTicket(ticketId);

    const comment = await this.commentRepository.create({
      ticketId,
      content: dto.content,
      isInternal: dto.isInternal || false,
      type: CommentType.AGENT,
      createdBy: userId,
      createdByName: userName,
    });

    // Update first response time if this is the first comment
    if (ticket.responseCount === 0 && !ticket.firstResponseAt) {
      await this.ticketRepository.update(ticketId, {
        firstResponseAt: new Date(),
        responseCount: 1,
      });
    } else {
      await this.ticketRepository.update(ticketId, {
        responseCount: ticket.responseCount + 1,
      });
    }

    return comment;
  }

  async getTicketComments(ticketId: string): Promise<TicketComment[]> {
    await this.getTicket(ticketId);
    return this.commentRepository.findByTicketId(ticketId);
  }

  // Note Operations
  async createNote(
    dto: CreateNoteDto,
    createdBy: string,
    createdByName: string,
  ): Promise<CustomerNote> {
    await this.getCustomer(dto.customerId);

    const note = await this.noteRepository.create({
      ...dto,
      createdBy,
      createdByName,
    });

    await this.activityRepository.logActivity(
      dto.customerId,
      ActivityType.NOTE_ADDED,
      `Note added by ${createdByName}`,
      createdBy,
      createdByName,
      { noteId: note.id },
    );

    return note;
  }

  async getCustomerNotes(customerId: string): Promise<CustomerNote[]> {
    await this.getCustomer(customerId);
    return this.noteRepository.findByCustomerId(customerId);
  }

  async deleteNote(id: string): Promise<void> {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    await this.noteRepository.delete(id);
  }
}
