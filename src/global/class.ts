import { Min, IsOptional, Matches, Max, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class Timestamp {
  createdAt: string;
  updatedAt: string;
}

export class GetPaginationParams {
  @ApiProperty({ default: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({ default: 10 })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(10000)
  size: number;

  @ApiPropertyOptional({ default: 'createdAt:asc' })
  @IsOptional()
  @Matches(/^[A-Za-z]+:(asc|desc)$/, { message: 'invalid query params sort' })
  sort?: string;
}
