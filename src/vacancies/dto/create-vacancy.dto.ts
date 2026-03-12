import {IsString, IsOptional, IsArray, IsInt, IsEnum, IsBoolean, IsNumber} from 'class-validator';
import {VacancyType} from "../../../generated/prisma/enums";
import {Type} from "class-transformer";

export class CreateVacancyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  salaryMax?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(VacancyType)
  type?: VacancyType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}