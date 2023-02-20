import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { AuthService } from 'src/auth/auth.service';
import { genId } from 'src/utils/helper';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: BaseFirestoreRepository<Transaction>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}
  private genTransactionId(userId: string) {
    return `TRANSACTION_${userId}_${genId()}`.toUpperCase();
  }

  async createTransaction(
    uid: string,
    amount: number,
    sessionId: string = null,
  ) {
    const id = this.genTransactionId(uid);
    const transaction: Transaction = {
      ...new Transaction(),
      id,
      userId: uid,
      amount,
      createdAt: new Date().toISOString(),
      sessionId: null,
    };
    if (sessionId) {
      transaction.sessionId = sessionId;
    }
    this.transactionRepository.runTransaction(async () => {
      await this.transactionRepository.create(transaction);
      await this.authService.updateBalance(uid, amount);
    });
  }
}
