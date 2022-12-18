import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetTopicsDto {
  @ApiPropertyOptional()
  @IsOptional()
  levelId: string;
}
