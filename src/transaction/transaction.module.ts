import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { FireormModule } from 'nestjs-fireorm';
// import { AuthModule } from 'src/auth/auth.module';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    FireormModule.forFeature([Transaction]),
    // forwardRef(() => AuthModule),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
