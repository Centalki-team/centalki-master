import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeacherSessionFeedbackDto {
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
  pronunciation: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  vocabularies: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  grammar: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  idea: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  fluency: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  suggest?: string;
}
