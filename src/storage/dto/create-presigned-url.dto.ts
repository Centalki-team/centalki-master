import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePresignedUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({ default: 'application/octet-stream' })
  @IsNotEmpty()
  @IsString()
  contentType: string;
}
