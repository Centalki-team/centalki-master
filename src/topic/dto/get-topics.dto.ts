import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetTopicsDto {
  @ApiPropertyOptional({ description: 'Id level của topic' })
  @IsOptional()
  levelId?: string;

  @ApiPropertyOptional({ description: 'Id category của topic' })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Keyword để tìm kiếm' })
  @IsOptional()
  keyword?: string;
}
