import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlockingDto {
  @ApiProperty({
    description: 'ID của người bị chặn',
  })
  @IsNotEmpty()
  @IsString()
  blockedId: string;
}
