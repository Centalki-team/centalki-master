import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class PutInterestedTopics {
  @ApiProperty({ description: 'Danh sách ID của các chủ đề' })
  @IsNotEmpty()
  @IsArray()
  interestedTopicIds: string[];
}
