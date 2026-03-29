import { IsString, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  vacancyId: string;

  @IsOptional()
  @IsString()
  coverLetter?: string;
}