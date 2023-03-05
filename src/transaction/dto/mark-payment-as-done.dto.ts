import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MarkPaymentAsDoneDto {
  @ApiProperty({
    description: 'ID của payment screenshot',
  })
  @IsNotEmpty()
  @IsString()
  paymentReceiptId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  apiKey: string;
}
