import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class GenerateDto {
  @IsString({ message: 'jobDescription must be a string' })
  @IsNotEmpty({ message: 'jobDescription cannot be empty' })
  @MinLength(30, {
    message: 'jobDescription is too short. Please provide a realistic job description (at least 30 characters).',
  })
  jobDescription: string;

  @IsString({ message: 'resume must be a string' })
  @IsNotEmpty({ message: 'resume cannot be empty' })
  @MinLength(30, {
    message: 'resume is too short. Please provide your existing resume text (at least 30 characters).',
  })
  resume: string;
}

export interface GenerateResponse {
  tailoredResume: string;
  outreachMessage: string;
}
