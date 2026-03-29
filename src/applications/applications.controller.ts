import {Controller, Get, Post, Body, Patch, Param, UseGuards} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import {InviteCandidateDto} from "./dto/invite-candidate.dto";
import {RolesGuard} from "../auth/guards/roles-guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {Role} from "../../generated/prisma/enums";
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Applications')
@Controller('applications')
@UseGuards(RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.APPLICANT)
  @ApiOperation({ summary: 'Apply for a vacancy (Applicant only)' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Already applied for this vacancy.' })
  create(@CurrentUser() applicantId: string, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(applicantId, createApplicationDto);
  }

  @Post('invite')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Invite a candidate to a vacancy (Employer only)' })
  @ApiResponse({ status: 201, description: 'Candidate invited successfully.' })
  invite(@CurrentUser() hrId: string, @Body() inviteDto: InviteCandidateDto) {
    return this.applicationsService.inviteCandidate(hrId, inviteDto);
  }

  @Get('my')
  @Roles(Role.APPLICANT)
  @ApiOperation({ summary: 'Get current user\'s applications history' })
  @ApiResponse({ status: 200, description: 'Application history retrieved.' })
  findMyApplications(@CurrentUser() applicantId: string) {
    return this.applicationsService.findMyApplications(applicantId);
  }

  @Get('vacancy/:vacancyId')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get all applications for a specific vacancy (Company Recruiter/Owner only)' })
  @ApiResponse({ status: 200, description: 'Applicants list retrieved.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You can only view applications for your company vacancies.' })
  findVacancyApplications(@Param('vacancyId') vacancyId: string, @CurrentUser() hrId: string) {
    return this.applicationsService.findVacancyApplications(vacancyId, hrId);
  }

  @Patch(':id/status')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Update applicant status (Company Recruiter/Owner only)' })
  @ApiResponse({ status: 200, description: 'Status updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You can only manage applications of your company.' })
  updateStatus(
    @Param('id') id: string,
    @CurrentUser() hrId: string,
    @Body() updateApplicationDto: UpdateApplicationDto
  ) {
    return this.applicationsService.updateStatus(id, hrId, updateApplicationDto);
  }
}