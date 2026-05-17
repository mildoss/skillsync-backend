import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import {PrismaService} from "../prisma.service";
import { ChatsGateway } from './chats.gateway';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, PrismaService, ChatsGateway],
})
export class ChatsModule {}
