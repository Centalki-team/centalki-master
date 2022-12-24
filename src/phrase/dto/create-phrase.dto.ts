import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePhraseDto {
  @ApiProperty({ required: true, description: 'Nội dung từ vựng' })
  @IsNotEmpty()
  phrase: string;

  @ApiProperty({ required: true, description: 'Id topic mà từ vựng thuộc về' })
  @IsNotEmpty()
  topicId: string;
}
