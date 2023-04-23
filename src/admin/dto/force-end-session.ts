import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForceEndDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  apiKey: string;
}
