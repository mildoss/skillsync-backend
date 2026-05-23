import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {PrismaService} from '../prisma.service';
import {GenerateCoverLetterDto, GenerateMatchingDto, GenerateVacancyDto} from './dto/generate.dto';
import {firstValueFrom} from 'rxjs';
import {AiGenerationType} from "../../generated/prisma/enums";

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
    await this.checkCredits(userId);

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

      const text = aiResponse.data.text;

      await this.prisma.aiGeneration.create({
        data: {
          userId,
          type: AiGenerationType.COVER_LETTER,
          content: text,
          vacancyId: dto.vacancyId
        },
      });

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

  async generateVacancyDescription(userId: string, dto: GenerateVacancyDto) {
    await this.checkCredits(userId);
    try {
      const aiResponse = await firstValueFrom(
        this.httpService.post(`${process.env.AI_SERVICE_URL}/generate/vacancy`, dto, {
          headers: { 'x-gateway-secret': process.env.GATEWAY_SECRET },
        }),
      );

      const text = aiResponse.data.text;

      await this.prisma.aiGeneration.create({
        data: { userId, type: AiGenerationType.VACANCY, content: text },
      });

      const updatedUser = await this.deductCredit(userId);

      return { text: aiResponse.data.text, remainingCredits: updatedUser.aiCredits };
    } catch (error) {
      throw new InternalServerErrorException('AI Service unavailable');
    }
  }

  async getMatchingScore(userId: string, dto: GenerateMatchingDto) {
    await this.checkCredits(userId);
    try {
      const aiResponse = await firstValueFrom(
        this.httpService.post(`${process.env.AI_SERVICE_URL}/generate/match`, dto, {
          headers: { 'x-gateway-secret': process.env.GATEWAY_SECRET },
        }),
      );

      const content = JSON.stringify(aiResponse.data);

      await this.prisma.aiGeneration.create({
        data: { userId, type: AiGenerationType.MATCHING, content, vacancyId: dto.vacancyId, applicationId: dto.applicationId },
      });

      const updatedUser = await this.deductCredit(userId);

      return {
        ...aiResponse.data,
        remainingCredits: updatedUser.aiCredits,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('AI Service unavailable');
    }
  }

  async getLatestDraft(userId: string, type: AiGenerationType, targetId?: string) {
    const whereCondition: any = { userId, type };

    if (targetId) {
      if (type === AiGenerationType.MATCHING) {
        whereCondition.applicationId = targetId;
      } else {
        whereCondition.vacancyId = targetId; 
      }
    }

    const draft = await this.prisma.aiGeneration.findFirst({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });

    if (!draft) return null;

    if (type === AiGenerationType.MATCHING) {
      return { id: draft.id, type: draft.type, data: JSON.parse(draft.content), createdAt: draft.createdAt };
    }

    return { id: draft.id, type: draft.type, text: draft.content, createdAt: draft.createdAt };
  }
}