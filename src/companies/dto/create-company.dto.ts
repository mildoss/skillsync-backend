import { IsString, IsOptional, IsUrl, IsEnum } from 'class-validator';
import { CompanyType } from '../../../generated/prisma/enums';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @IsEnum(CompanyType)
  companyType: CompanyType;
}