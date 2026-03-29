import {Controller, Get, Post, Body, Patch, Param, UseGuards} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import {InviteCandidateDto} from "./dto/invite-candidate.dto";
import {RolesGuard} from "../auth/guards/roles-guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {Role} from "../../generated/prisma/enums";
import {CurrentUser} from "../auth/decorators/current-user.decorator";

@Controller('applications')
@UseGuards(RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.APPLICANT)
  create(@CurrentUser() applicantId: string, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(applicantId, createApplicationDto);
  }

  @Post('invite')
  @Roles(Role.EMPLOYER)
  invite(@CurrentUser() hrId: string, @Body() inviteDto: InviteCandidateDto) {
    return this.applicationsService.inviteCandidate(hrId, inviteDto);
  }

  @Get('my')
  @Roles(Role.APPLICANT)
  findMyApplications(@CurrentUser() applicantId: string) {
    return this.applicationsService.findMyApplications(applicantId);
  }

  @Get('vacancy/:vacancyId')
  @Roles(Role.EMPLOYER)
  findVacancyApplications(@Param('vacancyId') vacancyId: string, @CurrentUser() hrId: string) {
    return this.applicationsService.findVacancyApplications(vacancyId, hrId);
  }

  @Patch(':id/status')
  @Roles(Role.EMPLOYER)
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() hrId: string,
    @Body() updateApplicationDto: UpdateApplicationDto
  ) {
    return this.applicationsService.updateStatus(id, hrId, updateApplicationDto);
  }
}