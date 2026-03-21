import { Module } from '@nestjs/common';
import { DictionariesService } from './dictionaries.service';
import { DictionariesController } from './dictionaries.controller';
import {PrismaService} from "../prisma.service";

@Module({
  controllers: [DictionariesController],
  providers: [DictionariesService, PrismaService],
})
export class DictionariesModule {}
