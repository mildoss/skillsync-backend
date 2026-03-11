import { IsString, IsOptional, IsArray, IsUrl, IsEnum } from 'class-validator';
import { CompanyType } from '../../../generated/prisma/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsUrl()
  cvUrl?: string;

  @IsOptional()
  @IsEnum(CompanyType)
  companyType?: CompanyType;
}