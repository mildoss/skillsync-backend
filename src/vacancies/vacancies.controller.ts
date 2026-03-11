import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UnauthorizedException } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { SearchVacanciesDto } from './dto/search-vacancies.dto';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  create(
    @Query('userId') employerId: string,
    @Body() createVacancyDto: CreateVacancyDto
  ) {
    if (!employerId) throw new UnauthorizedException('Missing employerId');

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
  update(
    @Param('id') id: string,
    @Query('userId') employerId: string,
    @Body() updateVacancyDto: UpdateVacancyDto
  ) {
    if (!employerId) throw new UnauthorizedException('Missing employerId');

    return this.vacanciesService.update(id, employerId, updateVacancyDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('userId') employerId: string
  ) {
    if (!employerId) throw new UnauthorizedException('Missing employerId');

    return this.vacanciesService.remove(id, employerId);
  }
}