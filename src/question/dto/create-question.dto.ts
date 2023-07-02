import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Answer } from 'src/topic/dto/create-topic.dto';

export class CreateQuestionDto {
  @ApiProperty({ required: true, description: 'Nội dung câu hỏi' })
  @IsNotEmpty()
  question: string;

  @ApiProperty({ required: true, description: 'Id topic mà câu hỏi thuộc về' })
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({ required: true, type: () => Answer, isArray: true })
  answers: Answer[];
}
