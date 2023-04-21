import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTopicFeedbackDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  topicId: string;

  @ApiProperty({
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicNameSummary: string[];

  @ApiProperty({})
  @IsOptional()
  @IsString()
  topicNameDetail?: string;

  @ApiProperty({
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicPhotoSummary: string[];

  @ApiProperty({})
  @IsOptional()
  @IsString()
  topicPhotoDetail?: string;

  @ApiProperty({
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicDescriptionSummary: string[];

  @ApiProperty({})
  @IsOptional()
  @IsString()
  topicDescriptionDetail?: string;

  @ApiProperty({
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicVocabSummary: string[];

  @ApiProperty({})
  @IsOptional()
  @IsString()
  topicVocabDetail?: string;

  @ApiProperty({
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicQuestionSummary: string[];

  @ApiProperty({})
  @IsOptional()
  @IsString()
  topicQuestionDetail?: string;
}
