import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';
import { CompaniesModule } from './companies/companies.module';
import { ApplicationsModule } from './applications/applications.module';
import { NotificationsModule } from './notifications/notifications.module';
import {APP_GUARD} from "@nestjs/core";
import {GatewaySecretGuard} from "./auth/guards/gateway-secret.guard";
import { AiModule } from './ai/ai.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [UsersModule, VacanciesModule, DictionariesModule, CompaniesModule, ApplicationsModule, NotificationsModule, AiModule, PaymentsModule],
  controllers: [],
  providers: [PrismaService, {
    provide: APP_GUARD,
    useClass: GatewaySecretGuard,
  },],
})
export class AppModule {}
