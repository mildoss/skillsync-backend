import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import {PrismaService} from "../prisma.service";
import {MediaService} from "../media/media.service";

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService, PrismaService, MediaService],
})
export class CompaniesModule {}
