import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRecord } from 'firebase-admin/auth';
import { User } from 'src/global/decorator';
import { FirebaseAuthGuard } from 'src/global/guard';
import { DepositDto } from './dto/deposit.dto';
import { PaginateTransactionDto } from './dto/get-transaction';
import { TransactionService } from './transaction.service';

@Controller('transaction')
@ApiTags('Giao dịch')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  @ApiOperation({
    summary: 'Nạp tiền',
    description: 'API dùng để nạp tiền cho user',
  })
  deposit(@Body() dto: DepositDto) {
    if (process.env.API_KEY !== dto.apiKey) {
      throw new ForbiddenException();
    }
    return this.transactionService.createTransaction(dto.userId, dto.amount);
  }

  @Get('')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lịch sử giao dịch',
    description: 'Phân trang lịch sử giao dịch của user dựa vào access token',
  })
  get(@Query() query: PaginateTransactionDto, @User() user: UserRecord) {
    return this.transactionService.paginateByUserId(query, user);
  }
}
