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
