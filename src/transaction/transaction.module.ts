import { forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { FireormModule } from 'nestjs-fireorm';
import { AuthModule } from 'src/auth/auth.module';
import { Transaction } from './entities/transaction.entity';
import { CommonModule } from 'src/common/common.module';
import { NotificationModule } from 'src/notification/notification.module';
import { FcmModule } from 'src/fcm/fcm.module';
import { PaymentReceipt } from 'src/transaction/entities/payment-receipt.entity';

@Module({
  imports: [
    FireormModule.forFeature([Transaction, PaymentReceipt]),
    forwardRef(() => AuthModule),
    CommonModule,
    NotificationModule,
    FcmModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
