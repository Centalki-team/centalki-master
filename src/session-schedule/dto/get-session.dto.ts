import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { GetPaginationParams } from 'src/global/class';
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

export class PaginateSessionDto extends GetPaginationParams {
  @ApiPropertyOptional({ enum: ESessionScheduleStatus })
  @IsEnum(ESessionScheduleStatus)
  @IsOptional()
  status?: ESessionScheduleStatus;
}
