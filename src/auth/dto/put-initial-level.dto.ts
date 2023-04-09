import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EInitialLevelType } from 'src/auth/enum/initial-level.enum';

export class PutInitialLevelDto {
  @ApiProperty({ description: 'Trình độ ban đầu của học viên' })
  @IsOptional()
  @IsString()
  initialLevelId?: string;

  @ApiProperty({ enum: EInitialLevelType })
  @IsNotEmpty()
  @IsEnum(EInitialLevelType)
  initialLevelType: EInitialLevelType;
}
