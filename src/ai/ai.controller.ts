import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateCoverLetterDto } from './dto/generate.dto';
import { RolesGuard } from '../auth/guards/roles-guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from "../../generated/prisma/enums";

@ApiTags('AI Generation')
@Controller('ai')
@UseGuards(RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('cover-letter')
  @Roles(Role.APPLICANT)
  @ApiOperation({ summary: 'Generate a cover letter using AI (Costs 1 AI Credit)' })
  @ApiResponse({ status: 201, description: 'Cover letter generated successfully.' })
  @ApiResponse({ status: 400, description: 'Not enough AI credits or invalid data.' })
  @ApiResponse({ status: 500, description: 'AI microservice is unavailable.' })
  generateCoverLetter(
    @CurrentUser() userId: string,
    @Body() dto: GenerateCoverLetterDto,
  ) {
    return this.aiService.generateCoverLetter(userId, dto);
  }
}