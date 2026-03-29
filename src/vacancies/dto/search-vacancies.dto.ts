import { IsOptional, IsString, IsInt, Min, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CompanyType, VacancyType } from "../../../generated/prisma/enums";
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchVacanciesDto {
  @ApiPropertyOptional({ description: 'Search by title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category UUID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by domain (e.g. Fintech)' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({ description: 'Filter by location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Maximum years of experience required' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  experience?: number;

  @ApiPropertyOptional({ enum: VacancyType, isArray: true, description: 'Filter by work formats (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  type?: VacancyType[];

  @ApiPropertyOptional({ enum: CompanyType, isArray: true, description: 'Filter by company types (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  companyType?: CompanyType[];

  @ApiPropertyOptional({ type: [String], description: 'Filter by skills UUIDs (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Filter by languages UUIDs (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ description: 'Minimum salary boundary' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMin?: number;

  @ApiPropertyOptional({ description: 'Show only active vacancies', default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}