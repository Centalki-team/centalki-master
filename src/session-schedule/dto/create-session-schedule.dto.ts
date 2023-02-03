import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSessionScheduleDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(128)
  studentId: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(128)
  topicId: string;

  @ApiPropertyOptional({ required: true })
  @IsOptional()
  @IsDateString()
  startAt?: string;
}
