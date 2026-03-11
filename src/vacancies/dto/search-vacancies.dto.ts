import { IsOptional, IsString, IsInt, Min, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {CompanyType, VacancyType} from "../../../generated/prisma/enums";

export class SearchVacanciesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  type?: VacancyType[];

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  companyType?: CompanyType[];

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean = true;

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