import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ required: true, description: 'Tên topic' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, description: 'Id level của topic' })
  @IsNotEmpty()
  levelId: string;

  @ApiProperty({ required: true, description: 'Id category của topic' })
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: true, description: 'Mô tả của topic' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true, description: 'Url hình ảnh minh họa topic' })
  @IsNotEmpty()
  imageURL: string;
}

class Data {
  @ApiProperty({ required: true })
  levelId: string;
  @ApiProperty({ required: true })
  name: string;
  @ApiProperty({ required: true })
  categoryId: string;
  @ApiProperty({ required: true })
  description: string;
  @ApiProperty({ required: true })
  imageURL: string;

  @ApiProperty({
    required: true,
    type: () => Question,
    isArray: true,
  })
  questions: Question[];

  @ApiProperty({
    required: true,
    type: () => Phrase,
    isArray: true,
  })
  phrases: Phrase[];
}

class Question {
  @ApiProperty({ required: true })
  topicId: string;
  @ApiProperty({ required: true })
  question: string;

  @ApiProperty({
    required: true,
    type: () => Answer,
    isArray: true,
  })
  answers: Answer[];
}

export class Answer {
  @ApiProperty({ required: true })
  answer: string;
}

class Phrase {
  @ApiProperty({ required: true })
  topicId: string;
  @ApiProperty({ required: true })
  phrase: string;

  @ApiProperty({
    required: true,
    type: () => Example,
    isArray: true,
  })
  examples: Example[];

  @ApiProperty({
    required: true,
    type: () => Translation,
    isArray: true,
  })
  translations: Translation[];
  @ApiProperty({ required: true })
  phonetic: string;
  @ApiProperty({ required: true })
  updatedAt: string;
}

class Example {
  @ApiProperty({ required: true })
  sentence: string;
}

class Translation {
  @ApiProperty({ required: true })
  meaning: string;
}

export class ImportJSONDto {
  @ApiProperty({
    required: true,
    description: 'JSON content',
    type: () => Data,
  })
  @IsNotEmpty()
  data: Data;
}
