import { IsString, IsOptional, IsArray, IsInt, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { VacancyType } from "../../../generated/prisma/enums";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVacancyDto {
  @ApiProperty({ example: 'Senior Node.js Developer', description: 'Job title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'We are looking for a backend engineer...', description: 'Full job description' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 3000, description: 'Minimum salary' })
  @IsOptional()
  @IsInt()
  salaryMin?: number;

  @ApiPropertyOptional({ example: 5000, description: 'Maximum salary' })
  @IsOptional()
  @IsInt()
  salaryMax?: number;

  @ApiPropertyOptional({ example: 'USD', description: 'Currency code' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ enum: VacancyType, example: VacancyType.REMOTE, description: 'Work format' })
  @IsOptional()
  @IsEnum(VacancyType)
  type?: VacancyType;

  @ApiPropertyOptional({ example: 'Odesa, Ukraine', description: 'Office location or Remote constraint' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'UUID of the domain', description: 'Domain of the vacancy' })
  @IsOptional()
  @IsString()
  domainId?: string;

  @ApiPropertyOptional({ description: 'UUID of the job category' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 3, description: 'Required years of experience' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  experience?: number;

  @ApiPropertyOptional({ type: [String], description: 'Array of Skill UUIDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Array of Language UUIDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ example: true, description: 'Is vacancy visible to applicants?' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}