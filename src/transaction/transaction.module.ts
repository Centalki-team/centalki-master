import { forwardRef, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { FireormModule } from 'nestjs-fireorm';
import { AuthModule } from 'src/auth/auth.module';
import { Transaction } from './entities/transaction.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    FireormModule.forFeature([Transaction]),
    forwardRef(() => AuthModule),
    CommonModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
