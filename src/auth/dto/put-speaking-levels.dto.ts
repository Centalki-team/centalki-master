import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class PutSpeakingLevels {
  @ApiProperty({ description: 'Danh sách ID của các speaking levels' })
  @IsNotEmpty()
  @IsArray()
  speakingLevelIds: string[];
}
