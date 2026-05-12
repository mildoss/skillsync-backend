import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private prisma: PrismaService) {}

  async processSuccessfulPayment(data: {
    userId: string;
    creditsToAdd: number;
    amountPaid: number;
    stripeSessionId: string;
  }) {
    const { userId, creditsToAdd, amountPaid, stripeSessionId } = data;

    try {
      await this.prisma.$transaction(async (tx) => {

        const existingTransaction = await tx.transaction.findUnique({
          where: { stripeSessionId }
        });

        if (existingTransaction) {
          this.logger.warn(`Transaction ${stripeSessionId} already processed. Skipping.`);
          return;
        }

        await tx.transaction.create({
          data: {
            stripeSessionId,
            userId,
            amountTotal: amountPaid,
            creditsAdded: creditsToAdd,
            status: 'COMPLETED',
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: {
            aiCredits: {
              increment: creditsToAdd,
            },
          },
        });

        this.logger.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);
      });
    } catch (error) {
      this.logger.error(`Failed to process payment ${stripeSessionId}: ${error.message}`);
      throw error;
    }
  }

  async getUserTransactions(userId: string) {
    return this.prisma.transaction.findMany({
      where: {userId},
      orderBy: {createdAt: 'desc'},
    });
  }
}