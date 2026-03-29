import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {Role} from "../../generated/prisma/enums";
import {RolesGuard} from "../auth/guards/roles-guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {CurrentUser} from "../auth/decorators/current-user.decorator";

@Controller('companies')
@UseGuards(RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(Role.EMPLOYER)
  create(@CurrentUser() userId: string, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(userId, createCompanyDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.companiesService.findAll(search);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.companiesService.findOne(idOrSlug);
  }

  @Post(':id/join')
  @Roles(Role.EMPLOYER)
  applyToCompany(@Param('id') companyId: string, @CurrentUser() userId: string) {
    return this.companiesService.applyToCompany(companyId, userId);
  }

  @Get(':id/requests')
  @Roles(Role.EMPLOYER)
  getRequests(@Param('id') companyId: string, @CurrentUser() userId: string) {
    return this.companiesService.getJoinRequests(companyId, userId);
  }

  @Patch(':id/requests/:requestId')
  @Roles(Role.EMPLOYER)
  handleRequest(
    @Param('requestId') requestId: string,
    @CurrentUser() userId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED'
  ) {
    return this.companiesService.handleJoinRequest(requestId, userId, status);
  }

  @Patch(':id')
  @Roles(Role.EMPLOYER)
  update(@Param('id') id: string, @CurrentUser() userId: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, userId, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(Role.EMPLOYER)
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.companiesService.remove(id, userId);
  }
}