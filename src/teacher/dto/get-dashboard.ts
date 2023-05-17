import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class GetDashboardDto {
  @ApiPropertyOptional()
  @IsDateString()
  from: string;

  @ApiPropertyOptional()
  @IsDateString()
  to: string;
}
