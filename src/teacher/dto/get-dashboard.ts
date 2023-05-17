import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class GetDashboardDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  from: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  to: string;
}
