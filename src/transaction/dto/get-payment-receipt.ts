import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class GetPaymentReceiptDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @ApiProperty({ default: false })
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isDone: boolean;
}
