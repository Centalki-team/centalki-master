import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentSessionFeedbackDto {
  @ApiProperty({
    description: 'ID của người bị chặn',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  rating: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  suggestForTeacher?: string;

  @ApiProperty({
    description: 'Không hài lòng với',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  notSatisfiedWith?: string[];

  @ApiProperty({
    description: 'Hài lòng với',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  satisfiedWith?: string[];
}
