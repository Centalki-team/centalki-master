import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetTopicsDto {
  @ApiPropertyOptional()
  levelId: string;
}
