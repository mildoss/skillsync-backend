import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EmploymentType, VacancyType } from '../../../generated/prisma/enums';

export class SearchUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  experience?: number;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  employmentTypes?: EmploymentType[];

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  workFormats?: VacancyType[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
