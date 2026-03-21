import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UnauthorizedException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @Query('userId') userId: string,
    @Body() createCompanyDto: CreateCompanyDto
  ) {
    if (!userId) throw new UnauthorizedException('Missing userId');
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
  applyToCompany(@Param('id') companyId: string, @Query('userId') userId: string) {
    if (!userId) throw new UnauthorizedException('Missing userId');
    return this.companiesService.applyToCompany(companyId, userId);
  }

  @Get(':id/requests')
  getRequests(@Param('id') companyId: string, @Query('userId') userId: string) {
    if (!userId) throw new UnauthorizedException('Missing userId');
    return this.companiesService.getJoinRequests(companyId, userId);
  }

  @Patch(':id/requests/:requestId')
  handleRequest(
    @Param('requestId') requestId: string,
    @Query('userId') userId: string,
    @Body('status') status: 'APPROVED' | 'REJECTED'
  ) {
    if (!userId) throw new UnauthorizedException('Missing userId');
    return this.companiesService.handleJoinRequest(requestId, userId, status);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ) {
    if (!userId) throw new UnauthorizedException('Missing userId');
    return this.companiesService.update(id, userId, updateCompanyDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('userId') userId: string
  ) {
    if (!userId) throw new UnauthorizedException('Missing userId');
    return this.companiesService.remove(id, userId);
  }
}