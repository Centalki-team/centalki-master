import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ required: true })
  @IsNumberString()
  @Type(() => Number)
  @IsNotEmpty()
  rating: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  text: string;
}
