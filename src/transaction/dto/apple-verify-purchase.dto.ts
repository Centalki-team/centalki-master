import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AppleVerifyPurchaseDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  verificationData: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  productId: string;
}
