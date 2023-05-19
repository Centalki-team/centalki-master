import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { UserRecord } from 'firebase-admin/auth';
import { User } from 'src/global/decorator';
import { FirebaseAuthGuard } from 'src/global/guard';
import { CreatePaymentReceiptDto } from 'src/transaction/dto/create-payment-receipt.dto';
import { GetPaymentReceiptDto } from 'src/transaction/dto/get-payment-receipt';
import { MarkPaymentAsDoneDto } from 'src/transaction/dto/mark-payment-as-done.dto';
import { DepositDto } from './dto/deposit.dto';
import { PaginateTransactionDto } from './dto/get-transaction';
import { TransactionService } from './transaction.service';
import { AppleVerifyPurchaseDto } from 'src/transaction/dto/apple-verify-purchase.dto';

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

  @Post('mark-payment-as-done')
  @ApiOperation({
    summary: 'Đánh dấu tiền đã được chuyển vào tài khoản user thành công',
  })
  markPaymentAsDone(@Body() dto: MarkPaymentAsDoneDto) {
    if (process.env.API_KEY !== dto.apiKey) {
      throw new ForbiddenException();
    }
    return this.transactionService.markPaymentAsDone(dto);
  }

  @Post('payment-receipt')
  @ApiOperation({
    summary: 'Tạo hoá đơn chuyển khoản (Manual payment)',
    description:
      'API cho user upload ảnh hoá đơn sau khi chuyển khoản thành công',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiResponseProperty({
    example: {
      userId: 'g0aEPfCDhHZO1k6K5rg4WrGw4nm1',
      imageURLs: [
        'https://img.vn/uploads/version/img24-png-20190726133727cbvncjKzsQ.png',
      ],
      doneAt: null,
      createdAt: '2023-03-12T05:49:23.485Z',
      id: 'Z5DVusTEEyxSLMRKkLMw',
    },
  })
  createPaymentReceipt(
    @Body() dto: CreatePaymentReceiptDto,
    @User() user: UserRecord,
  ) {
    return this.transactionService.createPaymentReceipt(user, dto);
  }

  @Get('payment-receipt')
  @ApiOperation({
    summary: 'Danh sách các manual payment cần xử lý',
  })
  getPaymentReceipt(@Query() query: GetPaymentReceiptDto) {
    if (process.env.API_KEY !== query.apiKey) {
      throw new ForbiddenException();
    }
    return this.transactionService.getPaymentReceipt(query);
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

  @Get('payment-info')
  @ApiOperation({
    summary: 'Thông tin nhận tiền',
  })
  getPaymentInfo() {
    return this.transactionService.getPaymentInfo();
  }

  @Post('apple/verify-purchase')
  @ApiOperation({
    summary: 'Call lên App Store để verify và update user balance',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  appleVerifyPurchase(
    @User() user: UserRecord,
    @Body() data: AppleVerifyPurchaseDto,
  ) {
    return this.transactionService.appleVerifyPurchase(data, user);
  }
}
