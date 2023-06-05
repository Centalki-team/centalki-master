import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ERole } from 'src/auth/enum/role.enum';

export class GetTeacherDto {
  @ApiProperty({ enum: ERole })
  @IsNotEmpty()
  @IsEnum(ERole)
  role: ERole;
}
