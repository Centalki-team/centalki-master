import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({ required: true, description: 'Nội dung câu hỏi' })
  @IsNotEmpty()
  question: string;

  @ApiProperty({ required: true, description: 'Id topic mà câu hỏi thuộc về' })
  @IsNotEmpty()
  topicId: string;
}
