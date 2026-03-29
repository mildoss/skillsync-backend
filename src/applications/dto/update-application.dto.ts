import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../../../generated/prisma/enums';

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}