import { Controller, Get, Post, Body, Patch, Param, Query, UnauthorizedException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import {InviteCandidateDto} from "./dto/invite-candidate.dto";

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(
    @Query('userId') applicantId: string,
    @Body() createApplicationDto: CreateApplicationDto
  ) {
    if (!applicantId) throw new UnauthorizedException('Missing userId');
    return this.applicationsService.create(applicantId, createApplicationDto);
  }

  @Post('invite')
  invite(
    @Query('userId') hrId: string,
    @Body() inviteDto: InviteCandidateDto
  ) {
    if (!hrId) throw new UnauthorizedException('Missing userId');
    return this.applicationsService.inviteCandidate(hrId, inviteDto);
  }

  @Get('my')
  findMyApplications(@Query('userId') applicantId: string) {
    if (!applicantId) throw new UnauthorizedException('Missing userId');
    return this.applicationsService.findMyApplications(applicantId);
  }

  @Get('vacancy/:vacancyId')
  findVacancyApplications(
    @Param('vacancyId') vacancyId: string,
    @Query('userId') hrId: string
  ) {
    if (!hrId) throw new UnauthorizedException('Missing userId');
    return this.applicationsService.findVacancyApplications(vacancyId, hrId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Query('userId') hrId: string,
    @Body() updateApplicationDto: UpdateApplicationDto
  ) {
    if (!hrId) throw new UnauthorizedException('Missing userId');
    return this.applicationsService.updateStatus(id, hrId, updateApplicationDto);
  }
}