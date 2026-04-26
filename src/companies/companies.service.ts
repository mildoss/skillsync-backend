import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {PrismaService} from "../prisma.service";
import {SearchCompaniesDto} from "./dto/search-companies.dto";

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(userId: string, createCompanyDto: CreateCompanyDto) {
    const user = await this.prisma.user.findUnique({where: {id: userId}});

    if (!user) throw new NotFoundException('User not found');
    if (user.companyId) throw new BadRequestException('You are already attached to a company');

    const slug = this.generateSlug(createCompanyDto.name);

    return this.prisma.$transaction(async (prisma) => {
      const company = await prisma.company.create({
        data: {
          ...createCompanyDto,
          slug
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          companyId: company.id,
          companyRole: 'OWNER'
        },
      });

      return company;
    })
  }

  async findAll(query: SearchCompaniesDto) {
    const { search, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { slug: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {};

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { vacancies: true, employees: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data: companies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async findOne(idOrSlug: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        OR: [
          {id: idOrSlug},
          {slug: idOrSlug},
        ],
      },
      include: {
        vacancies: {
          where: { isActive: true },
          include: {
            category: true,
            skills: true,
            languages: true,
            company: {
              select: {
                name: true,
                logoUrl: true,
                companyType: true
              }
            }
          }
        },
        employees: {
          select: { id: true, name: true, position: true, avatarUrl: true }
        }
      }
    });

    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, userId: string, updateCompanyDto: UpdateCompanyDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (user?.companyId !== id || user?.companyRole !== 'OWNER') {
      throw new ForbiddenException('Only the company owner can update company details');
    }

    let slug;
    if (updateCompanyDto.name) {
      slug = this.generateSlug(updateCompanyDto.name);
    }

    return this.prisma.company.update({
      where: { id },
      data: {
        ...updateCompanyDto,
        slug,
      },
    });
  }

  async remove(id: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (user?.companyId !== id || user?.companyRole !== 'OWNER') {
      throw new ForbiddenException('Only the company owner can delete the company');
    }

    return this.prisma.company.delete({
      where: { id },
    });
  }

  async leaveCompany(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.companyId) {
      throw new BadRequestException('You are not attached to any company');
    }

    if (user.companyRole === 'OWNER') {
      throw new BadRequestException('Owner cannot leave the company. You must delete the company first.');
    }

    return this.prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { id: userId },
        data: { companyId: null, companyRole: null }
      });

      await prisma.companyJoinRequest.deleteMany({
        where: { userId, companyId: user.companyId! }
      });

      return { success: true };
    });
  }

  async applyToCompany(companyId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.companyId) throw new BadRequestException('You are already in a company');

    const existingRequest = await this.prisma.companyJoinRequest.findUnique({
      where: { userId_companyId: { userId, companyId } }
    });

    if (existingRequest) {
      if (existingRequest.status === 'PENDING') {
        throw new ConflictException('Join request already sent');
      }
      throw new BadRequestException(`Your previous request was ${existingRequest.status}`);
    }

    return this.prisma.companyJoinRequest.create({
      data: {
        companyId,
        userId,
      }
    });
  }

  async removeEmployee(companyId: string, employeeId: string, userId: string) {
    const owner = await this.prisma.user.findUnique({ where: { id: userId } });

    if (owner?.companyId !== companyId || owner?.companyRole !== 'OWNER') {
      throw new ForbiddenException('Only company owners can manage employees');
    }

    if (userId === employeeId) {
      throw new BadRequestException('You cannot remove yourself from the company');
    }

    const employee = await this.prisma.user.findUnique({ where: { id: employeeId } });
    if (employee?.companyId !== companyId) {
      throw new NotFoundException('Employee not found in this company');
    }

    return this.prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id: employeeId },
        data: {
          companyId: null,
          companyRole: null,
        }
      });

      await prisma.companyJoinRequest.deleteMany({
        where: {
          userId: employeeId,
          companyId: companyId
        }
      });

      return updatedUser;
    });
  }

  async getMyJoinRequests(userId: string) {
    return this.prisma.companyJoinRequest.findMany({
      where: { userId },
      include: {
        company: { select: { id: true, name: true, logoUrl: true, companyType: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async cancelJoinRequest(requestId: string, userId: string) {
    const request = await this.prisma.companyJoinRequest.findUnique({ where: { id: requestId } });

    if (!request) throw new NotFoundException('Request not found');
    if (request.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own requests');
    }

    return this.prisma.companyJoinRequest.delete({
      where: { id: requestId }
    });
  }

  async getJoinRequests(companyId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.companyId !== companyId || user?.companyRole !== 'OWNER') {
      throw new ForbiddenException('Only company owners can view requests');
    }

    return this.prisma.companyJoinRequest.findMany({
      where: { companyId, status: 'PENDING' },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } }
      }
    });
  }

  async handleJoinRequest(requestId: string, userId: string, status: 'APPROVED' | 'REJECTED') {
    const request = await this.prisma.companyJoinRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Request not found');

    const owner = await this.prisma.user.findUnique({ where: { id: userId } });
    if (owner?.companyId !== request.companyId || owner?.companyRole !== 'OWNER') {
      throw new ForbiddenException('Only company owners can manage requests');
    }

    return this.prisma.$transaction(async (prisma) => {
      const updatedReq = await prisma.companyJoinRequest.update({
        where: { id: requestId },
        data: { status }
      });

      if (status === 'APPROVED') {
        await prisma.user.update({
          where: { id: request.userId },
          data: {
            companyId: request.companyId,
            companyRole: 'RECRUITER'
          }
        });

        await prisma.companyJoinRequest.deleteMany({
          where: {
            userId: request.userId,
            id: { not: requestId }
          }
        });
      }

      return updatedReq;
    });
  }
}
