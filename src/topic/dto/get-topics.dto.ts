import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetTopicsDto {
  @ApiPropertyOptional({ description: 'Id level của topic' })
  @IsOptional()
  levelId: string;
}
