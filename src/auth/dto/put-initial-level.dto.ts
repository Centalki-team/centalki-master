import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PutInitialLevelDto {
  @ApiProperty({ description: 'Trình độ ban đầu của học viên' })
  @IsNotEmpty()
  @IsString()
  initialLevelId: string;
}
