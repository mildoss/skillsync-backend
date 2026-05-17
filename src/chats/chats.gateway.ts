import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chats',
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatsService: ChatsService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.headers['x-user-id'] as string;
    const gatewaySecret = client.handshake.headers['x-gateway-secret'] as string;

    if (!userId || gatewaySecret !== process.env.GATEWAY_SECRET) {
      client.disconnect(true);
      return;
    }

    client.data.userId = userId;
  }

  handleDisconnect(_client: Socket) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() applicationId: string
  ) {
    try {
      const hasAccess = await this.chatsService.userCanAccessChat(
        client.data.userId,
        applicationId
      );

      if (!hasAccess) {
        client.emit('error', { message: 'Access denied' });
        return;
      }

      client.join(applicationId);
    } catch {
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() applicationId: string
  ) {
    client.leave(applicationId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { applicationId: string; text: string }
  ) {
    try {
      const userId = client.data.userId;

      const hasAccess = await this.chatsService.userCanAccessChat(
        userId,
        payload.applicationId
      );

      if (!hasAccess) {
        client.emit('error', { message: 'Access denied' });
        return;
      }

      const savedMessage = await this.chatsService.saveMessage(
        payload.applicationId,
        userId,
        payload.text
      );

      this.server.to(payload.applicationId).emit('receiveMessage', savedMessage);
    } catch {
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { applicationId: string; messageIds: string[] }
  ) {
    try {
      const userId = client.data.userId;

      await this.chatsService.markAsRead(
        payload.applicationId,
        userId,
        payload.messageIds
      );

      this.server.to(payload.applicationId).emit('messagesRead', {
        applicationId: payload.applicationId,
        readBy: userId,
        messageIds: payload.messageIds
      });
    } catch {
      client.emit('error', { message: 'Failed to mark as read' });
    }
  }
}