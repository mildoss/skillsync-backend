import { IsString, IsOptional, IsUrl, IsEnum } from 'class-validator';
import { CompanyType } from '../../../generated/prisma/enums';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class CreateCompanyDto {
  @ApiProperty({
    example: 'Burdovka inc',
    description: 'Company name'
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'The biggest IT-company in Burdovka',
    description: 'Description of activity'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/josef-logo.png',
    description: 'Link to logo'
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: 'https://burodvka.com',
    description: 'Official site'
  })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @ApiProperty({
    enum: CompanyType,
    example: 'PRODUCT',
    description: 'Type of company: PRODUCT, OUTSOURCE, OUTSTAFF or AGENCY'
  })
  @IsEnum(CompanyType)
  companyType: CompanyType;
}