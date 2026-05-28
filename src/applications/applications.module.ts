import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import {PrismaService} from "../prisma.service";
import {ChatsModule} from "../chats/chats.module";

@Module({
  imports: [ChatsModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PrismaService],
})
export class ApplicationsModule {}
