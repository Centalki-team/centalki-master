import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportingDto {
  @ApiProperty({
    description: 'ID của người bị chặn',
  })
  @IsNotEmpty()
  @IsString()
  reportedId: string;

  @ApiProperty({
    description: 'ID của buổi học',
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiProperty({
    description: 'Tóm tắt vấn đề',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  summary: string[];

  @ApiProperty({
    description: 'Chi tiết vấn đề',
  })
  @IsOptional()
  @IsString()
  detail?: string;
}
