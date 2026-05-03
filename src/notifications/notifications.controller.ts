import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles-guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notifications and unread count' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved.' })
  findAll(@CurrentUser() userId: string) {
    return this.notificationsService.getMyNotifications(userId);
  }

  @Patch('read')
  @ApiOperation({ summary: 'Mark all notifications as read for current user' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read.' })
  markAsRead(@CurrentUser() userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}