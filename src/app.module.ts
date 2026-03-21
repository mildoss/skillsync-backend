import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { DictionariesModule } from './dictionaries/dictionaries.module';

@Module({
  imports: [UsersModule, VacanciesModule, DictionariesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
