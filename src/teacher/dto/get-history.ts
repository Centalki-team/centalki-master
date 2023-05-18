import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, Matches } from 'class-validator';

const now = new Date();

export class GetHistoryDto {
  @ApiPropertyOptional({ default: now.toISOString() })
  @IsDateString()
  @IsOptional()
  to: string;

  @ApiPropertyOptional({
    default: new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 2,
        now.getHours(),
        now.getMinutes(),
      ),
    ).toISOString(),
  })
  @IsDateString()
  @IsOptional()
  from: string;

  @ApiPropertyOptional({ default: 'pickedUpAt:asc' })
  @IsOptional()
  @Matches(/^[A-Za-z]+:(asc|desc)$/, { message: 'invalid query params sort' })
  sort?: string;
}
