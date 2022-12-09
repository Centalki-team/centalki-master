import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePhraseDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  phrase: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  topicId: string;
}
