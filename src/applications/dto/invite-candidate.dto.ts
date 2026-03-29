import { IsString } from 'class-validator';

export class InviteCandidateDto {
  @IsString()
  applicantId: string;

  @IsString()
  vacancyId: string;

  @IsString()
  message: string;
}