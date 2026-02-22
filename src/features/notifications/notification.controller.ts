import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationService } from './services/notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  CreateNotificationDto,
  CreateBulkNotificationDto,
  NotificationQueryDto,
  UpdateNotificationPreferenceDto,
} from './dto/notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('api/notifications')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles('admin', 'editor')
  @RequirePermissions('notification:create')
  @ApiOperation({ summary: 'Create a notification' })
  @ApiResponse({ status: 201, description: 'Notification created' })
  async createNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationService.createNotification(dto);
  }

  @Post('bulk')
  @Roles('admin')
  @RequirePermissions('notification:create')
  @ApiOperation({ summary: 'Create bulk notifications for multiple users' })
  @ApiResponse({ status: 201, description: 'Notifications created' })
  async createBulkNotification(@Body() dto: CreateBulkNotificationDto) {
    return this.notificationService.createBulkNotification(dto);
  }

  @Get()
  @RequirePermissions('notification:read')
  @ApiOperation({ summary: 'Get all notifications for current user' })
  @ApiResponse({ status: 200, description: 'Returns user notifications' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  @ApiQuery({ name: 'isRead', required: false, example: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'isPinned', required: false })
  async getNotifications(
    @CurrentUser() user: any,
    @Query() query: NotificationQueryDto,
  ) {
    return this.notificationService.getUserNotifications(user.userId, query);
  }

  @Get('unread/count')
  @RequirePermissions('notification:read')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Returns unread count' })
  async getUnreadCount(@CurrentUser() user: any) {
    const count = await this.notificationService.getUnreadCount(user.userId);
    return { count };
  }

  @Get('recent')
  @RequirePermissions('notification:read')
  @ApiOperation({ summary: 'Get recent notifications' })
  @ApiResponse({ status: 200, description: 'Returns recent notifications' })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async getRecentNotifications(
    @CurrentUser() user: any,
    @Query('limit') limit?: number,
  ) {
    return this.notificationService.getRecentNotifications(
      user.userId,
      limit || 10,
    );
  }

  @Get('statistics')
  @RequirePermissions('notification:read')
  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiResponse({ status: 200, description: 'Returns statistics' })
  async getStatistics(@CurrentUser() user: any) {
    return this.notificationService.getStatistics(user.userId);
  }

  @Get('preferences')
  @RequirePermissions('notification:read')
  @ApiOperation({ summary: 'Get notification preferences' })
  @ApiResponse({ status: 200, description: 'Returns user preferences' })
  async getPreferences(@CurrentUser() user: any) {
    return this.notificationService.getPreferences(user.userId);
  }

  @Patch('preferences')
  @RequirePermissions('notification:update')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  async updatePreferences(
    @CurrentUser() user: any,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    return this.notificationService.updatePreferences(user.userId, dto);
  }

  @Get(':id')
  @RequirePermissions('notification:read')
  @ApiOperation({ summary: 'Get a notification by ID' })
  @ApiResponse({ status: 200, description: 'Returns notification' })
  async getNotification(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationService.getNotificationById(id, user.userId);
  }

  @Patch(':id/read')
  @RequirePermissions('notification:update')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationService.markAsRead(id, user.userId);
  }

  @Patch(':id/unread')
  @RequirePermissions('notification:update')
  @ApiOperation({ summary: 'Mark notification as unread' })
  @ApiResponse({ status: 200, description: 'Notification marked as unread' })
  async markAsUnread(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationService.markAsUnread(id, user.userId);
  }

  @Patch('read-all')
  @RequirePermissions('notification:update')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
  })
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationService.markAllAsRead(user.userId);
  }

  @Patch(':id/pin')
  @RequirePermissions('notification:update')
  @ApiOperation({ summary: 'Toggle pin status of notification' })
  @ApiResponse({ status: 200, description: 'Pin status toggled' })
  async togglePin(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationService.togglePin(id, user.userId);
  }

  @Delete(':id')
  @RequirePermissions('notification:delete')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  async deleteNotification(@Param('id') id: string, @CurrentUser() user: any) {
    await this.notificationService.deleteNotification(id, user.userId);
    return { message: 'Notification deleted successfully' };
  }

  @Delete('read/all')
  @RequirePermissions('notification:delete')
  @ApiOperation({ summary: 'Delete all read notifications' })
  @ApiResponse({ status: 200, description: 'Read notifications deleted' })
  async deleteAllRead(@CurrentUser() user: any) {
    return this.notificationService.deleteAllRead(user.userId);
  }
}
