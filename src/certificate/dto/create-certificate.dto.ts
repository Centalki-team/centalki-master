import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCertificateDto {
  @ApiProperty({
    description: 'Tên chứng chỉ',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ID của người dùng',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Link ảnh mặc trước của chứng chỉ',
    default: 'https://via.placeholder.com/300/09f/fff.png',
  })
  @IsOptional()
  @IsUrl()
  photoURL?: string;

  @ApiPropertyOptional({
    description: 'Link ảnh mặc sau của chứng chỉ',
    default: 'https://via.placeholder.com/300/09f/fff.png',
  })
  @IsOptional()
  @IsUrl()
  backPhotoURL?: string;

  @ApiPropertyOptional({
    description: 'Ngày cấp chứng chỉ',
    default: new Date().toISOString(),
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  issuedDate?: string;

  @ApiPropertyOptional({
    description: 'Nơi cấp chứng chỉ',
  })
  @IsOptional()
  @IsString()
  issuedDepartment?: string;
}
