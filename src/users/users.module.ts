import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import {MediaService} from "../media/media.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, MediaService],
})
export class UsersModule {}
