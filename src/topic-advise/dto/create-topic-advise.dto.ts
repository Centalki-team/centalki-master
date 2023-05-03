import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { EDifficulty } from 'src/topic-advise/enum/difficulty.enum';

export class CreateTopicAdviseDto {
  @ApiProperty({ required: true, description: 'Chủ đề' })
  @IsNotEmpty()
  subject: string;

  @ApiPropertyOptional({ description: 'Miêu tả chi tiết' })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    description: 'Độ khó của topic',
    enum: EDifficulty,
  })
  @IsOptional()
  @IsEnum(EDifficulty)
  difficulty: EDifficulty;
}
