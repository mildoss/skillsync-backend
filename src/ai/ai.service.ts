import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {PrismaService} from '../prisma.service';
import {GenerateCoverLetterDto} from './dto/generate.dto';
import {firstValueFrom} from 'rxjs';

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  private async checkCredits(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new BadRequestException('User not found');
    if (user.aiCredits <= 0) throw new BadRequestException('Not enough AI credits. Please top up your balance.');

    return user;
  }

  private async deductCredit(userId: string) {
    return this.prisma.user.update({
      where: {id: userId},
      data: {aiCredits: {decrement: 1}},
    });
  }

  async generateCoverLetter(userId: string, dto: GenerateCoverLetterDto) {
    const user = await this.checkCredits(userId);

    try {
      const aiResponse = await firstValueFrom(
        this.httpService.post(
          `${process.env.AI_SERVICE_URL}/generate/cover-letter`,
          dto,
          {
            headers: {
              'x-gateway-secret': process.env.GATEWAY_SECRET,
            },
          },
        ),
      );

      const updatedUser = await this.deductCredit(userId);

      return {
        text: aiResponse.data.text,
        remainingCredits: updatedUser.aiCredits,
      };

    } catch (error) {
      console.error('AI Service Error:', error?.response?.data || error.message);
      throw new InternalServerErrorException('AI Service is currently unavailable');
    }
  }
}