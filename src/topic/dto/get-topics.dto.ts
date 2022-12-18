import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { GetPaginationParams } from 'src/global/class';

export class GetTopicsDto extends GetPaginationParams {
  @ApiPropertyOptional()
  @IsOptional()
  levelId: string;
}
