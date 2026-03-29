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

@Controller('vacancies')
@UseGuards(RolesGuard)
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @Roles(Role.EMPLOYER)
  create(@CurrentUser() employerId: string, @Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(employerId, createVacancyDto);
  }

  @Get()
  findAll(@Query() query: SearchVacanciesDto) {
    return this.vacanciesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.EMPLOYER)
  update(@Param('id') id: string, @CurrentUser() employerId: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, employerId, updateVacancyDto);
  }

  @Delete(':id')
  @Roles(Role.EMPLOYER)
  remove(@Param('id') id: string, @CurrentUser() employerId: string) {
    return this.vacanciesService.remove(id, employerId);
  }
}