import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { SearchUsersDto } from './dto/search-user.dto';
import { Prisma, Role } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SearchUsersDto) {
    const {
      search,
      skills,
      category,
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

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (experience !== undefined) {
      where.experience = { gte: experience };
    }

    if (skills && skills.length > 0) {
      where.skills = { hasSome: skills };
    }

    if (languages && languages.length > 0) {
      where.languages = { hasSome: languages };
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
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
