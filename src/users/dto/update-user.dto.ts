import {IsString, IsOptional, IsArray, IsUrl, IsNumber} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {Type} from "class-transformer";
import {EmploymentType, VacancyType} from "../../../generated/prisma/enums";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Benya Shaslycnikov', description: 'Full name of the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Passionate Backend Developer...', description: 'Short biography' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ example: 'Senior Backend Developer', description: 'Current position' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ example: 'Odessa, Ukraine', description: 'Location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 3.5, description: 'Years of experience' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  experience?: number;

  @ApiPropertyOptional({ enum: VacancyType, isArray: true, description: 'Preferred work formats' })
  @IsOptional()
  @IsArray()
  workFormats?: VacancyType[];

  @ApiPropertyOptional({ enum: EmploymentType, isArray: true, description: 'Preferred employment types' })
  @IsOptional()
  @IsArray()
  employmentTypes?: EmploymentType[];

  @ApiPropertyOptional({ type: [String], description: 'Array of Skill UUIDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'Link to profile avatar' })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/resume.pdf', description: 'Link to CV/Resume' })
  @IsOptional()
  @IsUrl()
  cvUrl?: string;

  @ApiPropertyOptional({ description: 'UUID of the preferred job category' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ type: [String], description: 'Array of Language UUIDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];
}