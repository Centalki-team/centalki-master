import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  question: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  topicId: string;
}
