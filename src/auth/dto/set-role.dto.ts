import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ERole } from '../enum/role.enum';

export class SetRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  idToken: string;

  @ApiProperty({ enum: ERole })
  @IsNotEmpty()
  @IsEnum(ERole)
  role: ERole;
}
