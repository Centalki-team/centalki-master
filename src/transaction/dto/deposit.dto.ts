import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class DepositDto {
  @ApiProperty({
    description: 'Số tiền chuyển vào',
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'ID của người dùng',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  apiKey: string;
}
