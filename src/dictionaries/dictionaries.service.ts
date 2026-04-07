import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DictionariesService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getSkills() {
    return this.prisma.skill.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getLanguages() {
    return this.prisma.language.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getDomains() {
    return this.prisma.domain.findMany({
      orderBy: { name: 'asc' },
    })
  }
}