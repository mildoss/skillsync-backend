import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';

@Module({
  imports: [UsersModule, VacanciesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
