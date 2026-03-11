import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateVacancyDto} from './dto/create-vacancy.dto';
import {UpdateVacancyDto} from './dto/update-vacancy.dto';
import {PrismaService} from "../prisma.service";
import {SearchVacanciesDto} from "./dto/search-vacancies.dto";
import {Prisma} from '../../generated/prisma/client';

@Injectable()
export class VacanciesService {
  constructor(private prisma: PrismaService) {}

  async create(employerId: string, createVacancyDto: CreateVacancyDto) {
    return this.prisma.vacancy.create({
      data: {
        ...createVacancyDto,
        employerId,
      }
    })
  }

  async findAll(query: SearchVacanciesDto) {
    const {
      search, category, domain, location, experience,
      type, companyType, tags, salaryMin, isActive,
      page, limit,
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.VacancyWhereInput = {isActive};

    if (search) {
      where.OR = [
        {title: {contains: search, mode: 'insensitive'}},
        {description: {contains: search, mode: 'insensitive'}},
      ];
    }

    if (category) where.category = {equals: category, mode: 'insensitive'};
    if (domain) where.domain = {equals: domain, mode: 'insensitive'};
    if (location) where.location = {contains: location, mode: 'insensitive'};
    if (experience) where.experience = {equals: experience};

    if (salaryMin !== undefined) {
      where.OR = [
        ...(where.OR || []),
        {salaryMin: {gte: salaryMin}},
        {salaryMax: {gte: salaryMin}}
      ];
    }

    if (type && type.length > 0) {
      where.type = {in: type};
    }

    if (companyType && companyType.length > 0) {
      where.employer = {
        companyType: { in: companyType }
      };
    }

    if (tags && tags.length > 0) {
      where.tags = {hasSome: tags};
    }

    const [vacancies, total] = await Promise.all([
      this.prisma.vacancy.findMany({
        where,
        skip,
        take: limit,
        include: {
          employer: {
            select: { id: true, name: true, avatarUrl: true, companyType: true }
          }
        },
        orderBy: {createdAt: 'desc'}
      }),
      this.prisma.vacancy.count({where}),
    ]);

    return {
      data: vacancies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }
  }

  async findOne(id: string) {
    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id },
      include: {
        employer: {
          select: { id: true, name: true, about: true, avatarUrl: true, companyType: true }
        }
      }
    });

    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async update(id: string, employerId: string, updateVacancyDto: UpdateVacancyDto) {
    const vacancy = await this.findOne(id);

    if (vacancy.employerId !== employerId) {
      throw new ForbiddenException('You can only update your own vacancies');
    }

    return this.prisma.vacancy.update({
      where: { id },
      data: updateVacancyDto,
    });
  }

  async remove(id: string, employerId: string) {
    const vacancy = await this.findOne(id);

    if (vacancy.employerId !== employerId) {
      throw new ForbiddenException('You can only delete your own vacancies');
    }

    return this.prisma.vacancy.delete({
      where: { id },
    });
  }
}
