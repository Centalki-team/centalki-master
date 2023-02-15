import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ERole } from '../enum/role.enum';

export class SetRoleDto {
  @ApiProperty({ description: 'Firebase token của người dùng' })
  @IsNotEmpty()
  @IsString()
  idToken: string;

  @ApiProperty({ enum: ERole })
  @IsNotEmpty()
  @IsEnum(ERole)
  role: ERole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  displayName?: string;
}
