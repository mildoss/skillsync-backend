import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user chats' })
  @ApiResponse({ status: 200, description: 'The chat list has been successfully retrieved.' })
  getChats(@CurrentUser() userId: string) {
    return this.chatsService.getChats(userId);
  }

  @ApiOperation({ summary: 'Get chat messages by application/chat id' })
  @ApiResponse({ status: 200, description: 'The message list has been successfully retrieved.' })
  @Get(':id/messages')
  getMessages(
    @Param('id') applicationId: string,
    @CurrentUser() userId: string,
    @Query('cursor') cursor?: string
  ) {
    return this.chatsService.getMessages(applicationId, userId, cursor);
  }

  @Get('unread-count')
  @ApiResponse({ status: 200, description: 'Unread count has been successfully retrieved.' })
  @ApiOperation({ summary: 'Get unread messages count' })
  getUnreadCount(@CurrentUser() userId: string) {
    return this.chatsService.getUnreadCount(userId);
  }
}