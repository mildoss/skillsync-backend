import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { SearchUsersDto } from './dto/search-user.dto';
import {LocationType, Prisma, Role} from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(payload: { userId: number, email: string, username: string, role: Role }) {
    const { userId, email, username, role } = payload;
    const safeId = String(userId);

    try {
      await this.prisma.user.upsert({
        where: { id: safeId },
        update: {},
        create: {
          id: safeId,
          email,
          name: username,
          role,
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async findAll(query: SearchUsersDto) {
    const {
      search,
      skills,
      categoryId,
      location,
      experience,
      languages,
      employmentTypes,
      workFormats,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: Role.APPLICANT,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (location) {
      const locations = location.split(',').map(l =>
        l.trim().toUpperCase().replace(/\s+/g, '_') as LocationType
      );

      where.location = { in: locations };
    }

    if (experience && experience.length > 0) {
      const minExp = Math.min(...experience);
      where.experience = { gte: minExp };
    }

    if (skills && skills.length > 0) {
      where.skills = { some: { id: { in: skills } } };
    }

    if (languages && languages.length > 0) {
      where.languages = { some: { id: { in: languages } } };
    }

    if (employmentTypes && employmentTypes.length > 0) {
      where.employmentTypes = { hasSome: employmentTypes };
    }

    if (workFormats && workFormats.length > 0) {
      where.workFormats = { hasSome: workFormats };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          position: true,
          category: true,
          location: true,
          experience: true,
          skills: true,
          languages: true,
          workFormats: true,
          employmentTypes: true,
          avatarUrl: true,
          about: true,
          company: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        category: true,
        skills: true,
        languages: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const { skills, languages, location, ...restData } = updateUserDto;

    return this.prisma.user.update({
      where: { id },
      data: {
        ...restData,
        location: location
          ? (location.toUpperCase().replace(/\s+/g, '_') as LocationType)
          : undefined,
        skills: skills ? { set: skills.map((skillId) => ({ id: skillId })) } : undefined,
        languages: languages ? { set: languages.map((langId) => ({ id: langId })) } : undefined,
      },
    });
  }
}
