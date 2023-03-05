import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePaymentReceiptDto {
  @ApiProperty({ required: true, isArray: true })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty()
  imageURLs: string[];
}
