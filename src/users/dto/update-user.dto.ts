import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Benya Shaslycnikov', description: 'Full name of the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Passionate Backend Developer...', description: 'Short biography' })
  @IsOptional()
  @IsString()
  bio?: string;

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