import {Injectable, ForbiddenException, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async getChats(userId: string) {
    return this.prisma.application.findMany({
      where: {
        OR: [
          { applicantId: userId },
          { vacancy: { company: { employees: { some: { id: userId } } } } }
        ]
      },
      include: {
        vacancy: {
          select: { title: true, company: { select: { id: true, name: true, logoUrl: true } } }
        },
        applicant: {
          select: { id: true, name: true, surname: true, avatarUrl: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },

        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: userId }
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getMessages(applicationId: string, userId: string, cursor?: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        vacancy: { select: { companyId: true } }
      }
    });

    if (!application) {
      throw new NotFoundException('Chat not found');
    }

    const isApplicant = application.applicantId === userId;

    let isHr = false;
    if (!isApplicant) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      isHr = user?.companyId === application.vacancy.companyId;
    }

    if (!isApplicant && !isHr) {
      throw new ForbiddenException('You do not have access to this chat');
    }

    const take = 20;
    const messages = await this.prisma.message.findMany({
      where: { applicationId },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, surname: true, avatarUrl: true } }
      }
    });

    return messages;
  }

  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        isRead: false,
        senderId: { not: userId },
        application: {
          OR: [
            { applicantId: userId },
            { vacancy: { company: { employees: { some: { id: userId } } } } }
          ]
        }
      }
    });
  }

  async saveMessage(applicationId: string, senderId: string, text: string) {
    const message = await this.prisma.message.create({
      data: {
        text,
        applicationId,
        senderId
      },
      include: {
        sender: { select: { id: true, name: true, surname: true, avatarUrl: true } }
      }
    });

    await this.updateApplicationTimestamp(applicationId);

    return message;
  }

  async markAsRead(applicationId: string, userId: string, messageIds: string[]) {
    await this.prisma.message.updateMany({
      where: {
        applicationId,
        id: { in: messageIds },
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    });
  }

  async userCanAccessChat(userId: string, applicationId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        vacancy: {
          select: {
            companyId: true,
            company: {
              select: { employees: { where: { id: userId } } }
            }
          }
        }
      }
    });

    if (!application) return false;

    const isApplicant = application.applicantId === userId;
    const isHr = application.vacancy.company.employees.length > 0;

    return isApplicant || isHr;
  }

  async updateApplicationTimestamp(applicationId: string) {
    await this.prisma.application.update({
      where: { id: applicationId },
      data: { updatedAt: new Date() }
    });
  }
}