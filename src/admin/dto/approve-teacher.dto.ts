import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ApproveTeacherDto {
  @ApiProperty({ description: 'Email của người dùng' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
