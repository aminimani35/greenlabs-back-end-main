import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CrmService } from './services/crm.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import {
  CreateTicketDto,
  UpdateTicketDto,
  AssignTicketDto,
  AddCommentDto,
  CreateNoteDto,
} from './dto/ticket.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('CRM')
@Controller('crm')
@ApiBearerAuth('JWT-auth')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  // Customer Endpoints
  @Post('customers')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:customer:create')
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 409, description: 'Customer already exists' })
  async createCustomer(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: any,
  ) {
    return this.crmService.createCustomer(dto, user.userId, user.email);
  }

  @Get('customers')
  @RequirePermissions('crm:customer:read')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  async getCustomers(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.crmService.getCustomers({
      status,
      priority,
      search,
      assignedTo,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('customers/statistics')
  @RequirePermissions('crm:customer:read')
  @ApiOperation({ summary: 'Get customer statistics' })
  @ApiResponse({
    status: 200,
    description: 'Customer statistics retrieved successfully',
  })
  async getCustomerStatistics() {
    return this.crmService.getCustomerStatistics();
  }

  @Get('customers/:id')
  @RequirePermissions('crm:customer:read')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getCustomer(@Param('id') id: string) {
    return this.crmService.getCustomer(id);
  }

  @Put('customers/:id')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:customer:update')
  @ApiOperation({ summary: 'Update customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: any,
  ) {
    return this.crmService.updateCustomer(id, dto, user.userId, user.email);
  }

  @Delete('customers/:id')
  @Roles('admin')
  @RequirePermissions('crm:customer:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async deleteCustomer(@Param('id') id: string) {
    return this.crmService.deleteCustomer(id);
  }

  @Get('customers/:id/activities')
  @RequirePermissions('crm:activity:read')
  @ApiOperation({ summary: 'Get customer activities' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Activities retrieved successfully',
  })
  async getCustomerActivities(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.crmService.getCustomerActivities(
      id,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('customers/:id/notes')
  @RequirePermissions('crm:note:read')
  @ApiOperation({ summary: 'Get customer notes' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Notes retrieved successfully' })
  async getCustomerNotes(@Param('id') id: string) {
    return this.crmService.getCustomerNotes(id);
  }

  // Support Ticket Endpoints
  @Post('tickets')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:ticket:create')
  @ApiOperation({ summary: 'Create a support ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  async createTicket(@Body() dto: CreateTicketDto, @CurrentUser() user: any) {
    return this.crmService.createTicket(dto, user.userId, user.email);
  }

  @Get('tickets')
  @RequirePermissions('crm:ticket:read')
  @ApiOperation({ summary: 'Get all support tickets' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'assignedTo', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  async getTickets(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('category') category?: string,
    @Query('customerId') customerId?: string,
    @Query('assignedTo') assignedTo?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.crmService.getTickets({
      status,
      priority,
      category,
      customerId,
      assignedTo,
      search,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('tickets/statistics')
  @RequirePermissions('crm:ticket:read')
  @ApiOperation({ summary: 'Get ticket statistics' })
  @ApiResponse({
    status: 200,
    description: 'Ticket statistics retrieved successfully',
  })
  async getTicketStatistics() {
    return this.crmService.getTicketStatistics();
  }

  @Get('tickets/:id')
  @RequirePermissions('crm:ticket:read')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket found' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async getTicket(@Param('id') id: string) {
    return this.crmService.getTicket(id);
  }

  @Put('tickets/:id')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:ticket:update')
  @ApiOperation({ summary: 'Update ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async updateTicket(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.crmService.updateTicket(id, dto, user.userId, user.email);
  }

  @Patch('tickets/:id/assign')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:ticket:assign')
  @ApiOperation({ summary: 'Assign ticket to agent' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket assigned successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async assignTicket(
    @Param('id') id: string,
    @Body() dto: AssignTicketDto,
    @CurrentUser() user: any,
  ) {
    return this.crmService.assignTicket(id, dto, user.userId, user.email);
  }

  @Patch('tickets/:id/resolve')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:ticket:update')
  @ApiOperation({ summary: 'Resolve ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket resolved successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async resolveTicket(@Param('id') id: string, @CurrentUser() user: any) {
    return this.crmService.resolveTicket(id, user.userId, user.email);
  }

  @Patch('tickets/:id/close')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:ticket:update')
  @ApiOperation({ summary: 'Close ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Ticket closed successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async closeTicket(@Param('id') id: string, @CurrentUser() user: any) {
    return this.crmService.closeTicket(id, user.userId, user.email);
  }

  @Delete('tickets/:id')
  @Roles('admin')
  @RequirePermissions('crm:ticket:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 204, description: 'Ticket deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async deleteTicket(@Param('id') id: string) {
    return this.crmService.deleteTicket(id);
  }

  // Ticket Comment Endpoints
  @Post('tickets/:id/comments')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:ticket:update')
  @ApiOperation({ summary: 'Add comment to ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async addComment(
    @Param('id') ticketId: string,
    @Body() dto: AddCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.crmService.addComment(ticketId, dto, user.userId, user.email);
  }

  @Get('tickets/:id/comments')
  @RequirePermissions('crm:ticket:read')
  @ApiOperation({ summary: 'Get ticket comments' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async getTicketComments(@Param('id') ticketId: string) {
    return this.crmService.getTicketComments(ticketId);
  }

  // Note Endpoints
  @Post('notes')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:note:create')
  @ApiOperation({ summary: 'Create a customer note' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  async createNote(@Body() dto: CreateNoteDto, @CurrentUser() user: any) {
    return this.crmService.createNote(dto, user.userId, user.email);
  }

  @Delete('notes/:id')
  @Roles('admin', 'editor')
  @RequirePermissions('crm:note:create')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete note' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({ status: 204, description: 'Note deleted successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async deleteNote(@Param('id') id: string) {
    return this.crmService.deleteNote(id);
  }
}
