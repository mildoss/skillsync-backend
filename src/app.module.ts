import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';
import { CompaniesModule } from './companies/companies.module';
import { ApplicationsModule } from './applications/applications.module';
import {APP_GUARD} from "@nestjs/core";
import {GatewaySecretGuard} from "./auth/guards/gateway-secret.guard";

@Module({
  imports: [UsersModule, VacanciesModule, DictionariesModule, CompaniesModule, ApplicationsModule],
  controllers: [],
  providers: [PrismaService, {
    provide: APP_GUARD,
    useClass: GatewaySecretGuard,
  },],
})
export class AppModule {}
