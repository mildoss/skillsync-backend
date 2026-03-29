import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PrismaService } from '../prisma.service';
import {InviteCandidateDto} from "./dto/invite-candidate.dto";

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async create(applicantId: string, createApplicationDto: CreateApplicationDto) {
    const user = await this.prisma.user.findUnique({ where: { id: applicantId } });

    if (user?.role !== 'APPLICANT') {
      throw new ForbiddenException('Only applicants can apply for jobs');
    }

    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id: createApplicationDto.vacancyId }
    });

    if (!vacancy || !vacancy.isActive) {
      throw new NotFoundException('Vacancy is not active or does not exist');
    }

    const existingApp = await this.prisma.application.findUnique({
      where: {
        applicantId_vacancyId: {
          applicantId,
          vacancyId: createApplicationDto.vacancyId,
        }
      }
    });

    if (existingApp) throw new BadRequestException('You have already applied for this vacancy');

    return this.prisma.$transaction(async (prisma) => {
      const application = await prisma.application.create({
        data: {
          applicantId,
          vacancyId: createApplicationDto.vacancyId,
          coverLetter: createApplicationDto.coverLetter,
          status: 'PENDING'
        }
      });

      if (createApplicationDto.coverLetter) {
        await prisma.message.create({
          data: {
            text: createApplicationDto.coverLetter,
            applicationId: application.id,
            senderId: applicantId,
          }
        });
      }

      return application;
    });
  }

  async inviteCandidate(hrId: string, inviteDto: InviteCandidateDto) {
    const hr = await this.prisma.user.findUnique({ where: { id: hrId } });

    if (hr?.role !== 'EMPLOYER') {
      throw new ForbiddenException('Only employers can invite candidates');
    }

    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id: inviteDto.vacancyId }
    });

    if (!vacancy || vacancy.companyId !== hr.companyId) {
      throw new ForbiddenException('You can only invite candidates to your own company vacancies');
    }

    const existingApp = await this.prisma.application.findUnique({
      where: {
        applicantId_vacancyId: {
          applicantId: inviteDto.applicantId,
          vacancyId: inviteDto.vacancyId,
        }
      }
    });

    if (existingApp) {
      throw new BadRequestException('A conversation about this vacancy already exists');
    }

    return this.prisma.$transaction(async (prisma) => {
      const application = await prisma.application.create({
        data: {
          applicantId: inviteDto.applicantId,
          vacancyId: inviteDto.vacancyId,
          status: 'INVITED'
        }
      });

      await prisma.message.create({
        data: {
          text: inviteDto.message,
          applicationId: application.id,
          senderId: hrId,
        }
      });

      return application;
    });
  }

  async findMyApplications(applicantId: string) {
    return this.prisma.application.findMany({
      where: { applicantId },
      include: {
        vacancy: {
          select: { id: true, title: true, salaryMin: true, salaryMax: true, company: { select: { name: true, logoUrl: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findVacancyApplications(vacancyId: string, hrId: string) {
    const hr = await this.prisma.user.findUnique({ where: { id: hrId } });
    const vacancy = await this.prisma.vacancy.findUnique({ where: { id: vacancyId } });

    if (!vacancy) throw new NotFoundException('Vacancy not found');
    if (hr?.companyId !== vacancy.companyId) {
      throw new ForbiddenException('You can only view applications for your company vacancies');
    }

    return this.prisma.application.findMany({
      where: { vacancyId },
      include: {
        applicant: {
          select: { id: true, name: true, position: true, avatarUrl: true, experience: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, hrId: string, updateDto: UpdateApplicationDto) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { vacancy: true }
    });

    if (!application) throw new NotFoundException('Application not found');

    const hr = await this.prisma.user.findUnique({ where: { id: hrId } });

    if (hr?.companyId !== application.vacancy.companyId) {
      throw new ForbiddenException('You can only manage applications of your company');
    }

    return this.prisma.application.update({
      where: { id },
      data: { status: updateDto.status }
    });
  }
}