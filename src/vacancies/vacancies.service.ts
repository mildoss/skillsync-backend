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
    const hr = await this.prisma.user.findUnique({ where: { id: employerId } });

    if (!hr || !hr.companyId) {
      throw new ForbiddenException('You must be attached to a company to create vacancies');
    }

    const { skills, languages, ...restData } = createVacancyDto;

    return this.prisma.vacancy.create({
      data: {
        ...restData,
        companyId: hr.companyId,
        skills: skills ? { connect: skills.map((id) => ({ id })) } : undefined,
        languages: languages ? { connect: languages.map((id) => ({ id })) } : undefined,
      }
    });
  }

  async findAll(query: SearchVacanciesDto) {
    const {
      search, categoryId, domain, location, experience,
      type, companyType, skills, salaryMin, isActive,
      languages ,page, limit,
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.VacancyWhereInput = {isActive};

    if (search) {
      where.OR = [
        {title: {contains: search, mode: 'insensitive'}},
        {description: {contains: search, mode: 'insensitive'}},
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (domain) where.domain = {equals: domain, mode: 'insensitive'};
    if (location) where.location = {contains: location, mode: 'insensitive'};

    if (experience !== undefined) {
      where.experience = { lte: experience };
    }

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
      where.company = {
        companyType: { in: companyType }
      };
    }

    if (skills && skills.length > 0) {
      where.skills = { some: { id: { in: skills } } };
    }
    if (languages && languages.length > 0) {
      where.languages = { some: { id: { in: languages } } };
    }

    const [vacancies, total] = await Promise.all([
      this.prisma.vacancy.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          company: {
            select: { id: true, name: true, logoUrl: true, companyType: true }
          },
          skills: true,
          languages: true,
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
        category: true,
        skills: true,
        languages: true,
        company: {
          select: { id: true, name: true, description: true, logoUrl: true, companyType: true, websiteUrl: true }
        }
      }
    });

    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async update(id: string, employerId: string, updateVacancyDto: UpdateVacancyDto) {
    const vacancy = await this.findOne(id);
    const hr = await this.prisma.user.findUnique({ where: { id: employerId } });

    if (vacancy.companyId !== hr?.companyId) {
      throw new ForbiddenException('You can only update vacancies of your company');
    }

    const { skills, languages, ...restData } = updateVacancyDto;

    return this.prisma.vacancy.update({
      where: { id },
      data: {
        ...restData,
        skills: skills ? { set: skills.map((skillId) => ({ id: skillId })) } : undefined,
        languages: languages ? { set: languages.map((langId) => ({ id: langId })) } : undefined,
      },
    });
  }

  async remove(id: string, employerId: string) {
    const vacancy = await this.findOne(id);
    const hr = await this.prisma.user.findUnique({ where: { id: employerId } });

    if (vacancy.companyId !== hr?.companyId) {
      throw new ForbiddenException('You can only delete vacancies of your company');
    }

    return this.prisma.vacancy.delete({
      where: { id },
    });
  }
}

