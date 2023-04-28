import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EDifficulty } from 'src/topic-advise/enum/difficulty.enum';

export class CreateTopicAdviseDto {
  @ApiProperty({ required: true, description: 'Chủ đề' })
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ required: true, description: 'Miêu tả chi tiết' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    required: true,
    description: 'Độ khó của topic',
    enum: EDifficulty,
  })
  @IsEnum(EDifficulty)
  @IsNotEmpty()
  difficulty: EDifficulty;
}
