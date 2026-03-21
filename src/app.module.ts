import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [UsersModule, VacanciesModule, DictionariesModule, CompaniesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
