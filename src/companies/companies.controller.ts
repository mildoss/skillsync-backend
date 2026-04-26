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
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {SearchCompaniesDto} from "./dto/search-companies.dto";

@ApiTags('Companies')
@Controller('companies')
@UseGuards(RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Create new company' })
  @ApiResponse({ status: 201, description: 'The company was successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation error (or the user is already a member of the company).' })
  @ApiResponse({ status: 403, description: 'Access denied. EMPLOYER role required.' })
  create(@CurrentUser() userId: string, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(userId, createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all companies with pagination' })
  @ApiResponse({ status: 200, description: 'List of companies successfully received.' })
  findAll(@Query() query: SearchCompaniesDto) {
    return this.companiesService.findAll(query);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get a specific company by ID or Slug' })
  @ApiParam({ name: 'idOrSlug', description: 'Company UUID or string Slug.' })
  @ApiResponse({ status: 200, description: 'Company details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.companiesService.findOne(idOrSlug);
  }

  @Post(':id/join')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Apply to join a company as a recruiter (Unattached Employer only)' })
  @ApiResponse({ status: 201, description: 'Join request successfully sent.' })
  applyToCompany(@Param('id') companyId: string, @CurrentUser() userId: string) {
    return this.companiesService.applyToCompany(companyId, userId);
  }

  @Get('requests/me')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get all join requests sent by current user' })
  @ApiResponse({ status: 200, description: 'List of sent requests retrieved.' })
  getMyRequests(@CurrentUser() userId: string) {
    return this.companiesService.getMyJoinRequests(userId);
  }

  @Delete('requests/:requestId')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Cancel a pending join request' })
  @ApiResponse({ status: 200, description: 'Request cancelled successfully.' })
  cancelRequest(@Param('requestId') requestId: string, @CurrentUser() userId: string) {
    return this.companiesService.cancelJoinRequest(requestId, userId);
  }

  @Get(':id/requests')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get all pending join requests for a company' })
  @ApiResponse({ status: 200, description: 'List of requests retrieved.' })
  @ApiResponse({ status: 403, description: 'Only company OWNER can view requests.' })
  getRequests(@Param('id') companyId: string, @CurrentUser() userId: string) {
    return this.companiesService.getJoinRequests(companyId, userId);
  }

  @Patch(':id/requests/:requestId')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Approve or reject a join request (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Request status updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only the company OWNER can manage requests.' })
  handleRequest(
    @Param('requestId') requestId: string,
    @CurrentUser() userId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED'
  ) {
    return this.companiesService.handleJoinRequest(requestId, userId, status);
  }

  @Delete(':id/employees/:employeeId')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Remove an employee from the company (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Employee removed successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  removeEmployee(
    @Param('id') companyId: string,
    @Param('employeeId') employeeId: string,
    @CurrentUser() userId: string
  ) {
    return this.companiesService.removeEmployee(companyId, employeeId, userId);
  }

  @Patch(':id')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Update company details (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Company updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only the company OWNER can update details.' })
  update(@Param('id') id: string, @CurrentUser() userId: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, userId, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Delete a company (OWNER only)' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only the company OWNER can delete the company.' })
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.companiesService.remove(id, userId);
  }

  @Post('leave')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Leave current company (Recruiter only)' })
  leave(@CurrentUser() userId: string) {
    return this.companiesService.leaveCompany(userId);
  }
}