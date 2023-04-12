import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTopicBookmarkDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  topicId: string;
}
