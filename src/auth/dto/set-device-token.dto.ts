import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SetDeviceTokenDto {
  @ApiProperty({ description: 'Device token của người dùng' })
  @IsNotEmpty()
  @IsString()
  token: string;
}
