import {IsString, IsArray, IsOptional, ArrayMinSize} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateCoverLetterDto {
  @ApiProperty({ example: 'Full Stack Developer (Next.js & NestJS)', description: 'The title of the vacancy' })
  @IsString()
  vacancyTitle: string;

  @ApiProperty({ example: 'Looking for a dev with React and Node.js experience.', description: 'The description of the vacancy' })
  @IsString()
  vacancyDescription: string;

  @ApiPropertyOptional({ description: 'Vacancy id' })
  @IsOptional()
  @IsString()
  vacancyId: string;

  @ApiPropertyOptional({ example: 'I am a fast learner and love coding.', description: 'Candidate bio or motivation' })
  @IsOptional()
  @IsString()
  candidateAbout?: string;

  @ApiProperty({ example: ['React', 'NestJS', 'PostgreSQL'], description: 'List of candidate skills' })
  @IsArray()
  @IsString({ each: true })
  candidateSkills: string[];

  @ApiPropertyOptional({ example: '1 year of experience building web apps.', description: 'Candidate work experience' })
  @IsOptional()
  @IsString()
  candidateExperience?: string;
}

export class GenerateMatchingDto extends GenerateCoverLetterDto {
  @IsString()
  applicationId: string; 
}

export class GenerateVacancyDto {
  @ApiProperty({ example: 'Senior Node.js Backend Engineer', description: 'The job title to generate description for' })
  @IsString()
  jobTitle: string;

  @ApiProperty({ example: ['NestJS', 'Kafka', 'Microservices', 'Docker'], description: 'Key requirements and skills' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  keywords: string[];
}