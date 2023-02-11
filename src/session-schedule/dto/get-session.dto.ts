import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ESessionScheduleStatus } from '../enum/session-schedule-status.enum';

export class GetSessionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(128)
  studentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(128)
  teacherId?: string;

  @ApiPropertyOptional({ enum: ESessionScheduleStatus })
  @IsEnum(ESessionScheduleStatus)
  @IsOptional()
  status?: ESessionScheduleStatus;
}
