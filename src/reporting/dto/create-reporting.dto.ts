import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportingDto {
  @ApiProperty({
    description: 'ID của người bị chặn',
  })
  @IsNotEmpty()
  @IsString()
  reportedId: string;

  @ApiProperty({
    description: 'Tóm tắt vấn đề',
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    description: 'Chi tiết vấn đề',
  })
  @IsOptional()
  @IsString()
  detail?: string;
}
