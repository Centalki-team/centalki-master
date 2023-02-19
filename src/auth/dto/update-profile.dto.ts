import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { EGender } from '../enum/gender.enum';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Link ảnh đại diện mới',
    default: 'https://via.placeholder.com/300/09f/fff.png',
  })
  @IsOptional()
  @IsUrl()
  photoURL?: string;

  @ApiPropertyOptional({ description: 'Tên mới' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ description: 'Nickname tiếng anh' })
  @IsOptional()
  @IsString()
  englishName?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại mới',
    default: '+84374246292',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Ngày sinh của người dùng',
    default: new Date().toISOString(),
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiPropertyOptional({
    description: 'Giới thiệu',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Quốc tịch',
  })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({
    description: 'Thông tin về giáo dục',
  })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({
    description: 'Kinh nghiệm',
  })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiPropertyOptional({
    description: 'Giới tính của người dùng',
    enum: EGender,
  })
  @IsOptional()
  @IsEnum(EGender)
  gender?: string;
}
