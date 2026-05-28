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
import { PrismaService } from "../prisma.service";
import { WsJwtService } from "../auth/ws-jwt.service";

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chats',
  transports: ['websocket']
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private chatsService: ChatsService,
    private prisma: PrismaService,
    private wsJwtService: WsJwtService,
    ) {}

  async handleConnection(client: Socket) {
    const { token } = client.handshake.auth;

    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const decoded = await this.wsJwtService.verifyToken(token);
      const userId = String(decoded.userId);

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        client.disconnect(true);
        return;
      }

      client.data.userId = userId;
    } catch {
      client.disconnect(true);
    }
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

      const application = await this.prisma.application.findUnique({
        where: { id: payload.applicationId },
        include: { vacancy: { select: { isActive: true } } }
      });

      if (!application) return client.emit('error', { message: 'Chat not found' });

      if (!application.vacancy.isActive) {
        return client.emit('error', { message: 'This vacancy is closed. Chat is frozen.' });
      }

      const isApplicant = application.applicantId === userId;

      if (isApplicant && application.status === 'PENDING') {
        return client.emit('error', { message: 'Wait for the recruiter to accept your application.' });
      }

      if (application.status === 'REJECTED') {
        return client.emit('error', { message: 'Discussion closed. Application rejected.' });
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