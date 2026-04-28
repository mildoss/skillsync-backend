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
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { SearchVacanciesDto } from './dto/search-vacancies.dto';
import {Roles} from "../auth/decorators/roles.decorator";
import {Role} from "../../generated/prisma/enums";
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {RolesGuard} from "../auth/guards/roles-guard";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Vacancies')
@Controller('vacancies')
@UseGuards(RolesGuard)
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Create a new vacancy (Employer attached to a company only)' })
  @ApiResponse({ status: 201, description: 'Vacancy successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You must be attached to a company to create vacancies.' })
  create(@CurrentUser() employerId: string, @Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(employerId, createVacancyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vacancies with advanced filtering and pagination' })
  @ApiResponse({ status: 200, description: 'List of vacancies retrieved successfully.' })
  findAll(@Query() query: SearchVacanciesDto) {
    return this.vacanciesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific vacancy by ID' })
  @ApiResponse({ status: 200, description: 'Vacancy details retrieved successfully.' })
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Get('my')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Get all vacancies of the current user`s company' })
  @ApiResponse({ status: 200, description: 'List of vacancies retrieved successfully.' })
  findMyVacancies(@CurrentUser() employerId: string) {
    return this.vacanciesService.findMyVacancies(employerId);
  }

  @Patch(':id')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Update vacancy details (Company Recruiter or Owner only)' })
  @ApiResponse({ status: 200, description: 'Vacancy updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You can only update vacancies of your own company.' })
  update(@Param('id') id: string, @CurrentUser() employerId: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, employerId, updateVacancyDto);
  }

  @Delete(':id')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Delete a vacancy (Company Recruiter or Owner only)' })
  @ApiResponse({ status: 200, description: 'Vacancy deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You can only delete vacancies of your own company.' })
  remove(@Param('id') id: string, @CurrentUser() employerId: string) {
    return this.vacanciesService.remove(id, employerId);
  }
}