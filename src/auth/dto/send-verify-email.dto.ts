import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendVerifyEmailDto {
  @ApiProperty({
    description: 'Email của user',
  })
  @IsEmail()
  email: string;
}
