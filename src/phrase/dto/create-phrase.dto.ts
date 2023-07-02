import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IExample, ITranslation } from '../interface/example.interface';

export class CreatePhraseDto {
  @ApiProperty({ required: true, description: 'Nội dung từ vựng' })
  @IsNotEmpty()
  phrase: string;

  @ApiProperty({ required: true, description: 'Id topic mà từ vựng thuộc về' })
  @IsNotEmpty()
  topicId: string;

  phonetic?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  translations: ITranslation[];

  @ApiProperty({ required: true })
  @IsNotEmpty()
  examples: IExample[];
}
