import { IsOptional, IsString, IsInt, Min, IsArray, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EmploymentType, VacancyType } from '../../../generated/prisma/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchUsersDto {
  @ApiPropertyOptional({ description: 'Search by name or position' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category UUID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Minimum years of experience' })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.split(',').map(Number);

    if (Array.isArray(value)) return value.map(Number);

    return [Number(value)];
  })
  @IsArray()
  @IsNumber({}, { each: true })
  experience?: number[];

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

  @ApiPropertyOptional({ enum: EmploymentType, isArray: true, description: 'Filter by employment types (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  employmentTypes?: EmploymentType[];

  @ApiPropertyOptional({ enum: VacancyType, isArray: true, description: 'Filter by work formats (comma-separated)' })
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  workFormats?: VacancyType[];

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