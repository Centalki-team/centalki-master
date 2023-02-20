import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { DepositDto } from './dto/deposit.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  deposit(@Body() dto: DepositDto) {
    if (process.env.API_KEY !== dto.apiKey) {
      throw new ForbiddenException();
    }
    return this.transactionService.createTransaction(dto.userId, dto.amount);
  }
}
