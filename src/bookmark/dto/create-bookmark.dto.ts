import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  phraseId: string;
}
