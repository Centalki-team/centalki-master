import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  levelId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  imageURL: string;
}
