import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRecord } from 'firebase-admin/auth';
import {
  BaseFirestoreRepository,
  FirestoreOperators,
  IFireOrmQueryLine,
} from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { AuthService } from 'src/auth/auth.service';
import { CommonService } from 'src/common/common.service';
import { FcmService } from 'src/fcm/fcm.service';
import { NOTIFICATION } from 'src/global/constant';
import { PaginationResult } from 'src/global/types';
import { NotificationService } from 'src/notification/notification.service';
import { CreatePaymentReceiptDto } from 'src/transaction/dto/create-payment-receipt.dto';
import { GetPaymentReceiptDto } from 'src/transaction/dto/get-payment-receipt';
import { MarkPaymentAsDoneDto } from 'src/transaction/dto/mark-payment-as-done.dto';
import { PaymentReceipt } from 'src/transaction/entities/payment-receipt.entity';
import { genId } from 'src/utils/helper';
import { PaginateTransactionDto } from './dto/get-transaction';
import { Transaction } from './entities/transaction.entity';

@Injectable()
@ApiTags('Giao dịch')
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: BaseFirestoreRepository<Transaction>,

    @InjectRepository(PaymentReceipt)
    private paymentReceiptRepository: BaseFirestoreRepository<PaymentReceipt>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private commonService: CommonService,
    private fcmService: FcmService,
    private notificationService: NotificationService,
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
    this.transactionRepository
      .runTransaction(async () => {
        await this.transactionRepository.create(transaction);
        await this.authService.updateBalance(uid, amount);
      })
      .then(async () => {
        if (sessionId) return null;
        const deviceTokens = await this.authService.getDeviceTokens([uid]);
        if (deviceTokens.length) {
          this.fcmService.sendMulticast({
            tokens: deviceTokens,
            notification: {
              title: NOTIFICATION.DEPOSIT_SUCCESS.TITLE(),
              body: NOTIFICATION.DEPOSIT_SUCCESS.BODY(amount),
            },
            data: NOTIFICATION.DEPOSIT_SUCCESS.PAYLOAD(amount),
          });
        }
        this.notificationService.create({
          uid,
          title: {
            en: NOTIFICATION.DEPOSIT_SUCCESS.TITLE(),
          },
          body: {
            en: NOTIFICATION.DEPOSIT_SUCCESS.BODY(amount),
          },
          data: NOTIFICATION.DEPOSIT_SUCCESS.PAYLOAD(amount),
        });
      });
  }

  async paginateByUserId(
    query: PaginateTransactionDto,
    user: UserRecord,
  ): Promise<PaginationResult<Transaction>> {
    const { page, size, sort } = query;

    const queries: IFireOrmQueryLine[] = [
      {
        prop: 'userId',
        val: user.uid,
        operator: FirestoreOperators.equal,
      },
    ];

    const { data, hasNextPage, hasPrevPage } = await this.commonService.find(
      this.transactionRepository,
      queries,
      page,
      size,
      sort,
    );

    return {
      meta: {
        hasNextPage,
        hasPrevPage,
        page,
        size,
      },
      data,
    };
  }

  async createPaymentReceipt(user: UserRecord, dto: CreatePaymentReceiptDto) {
    await this.authService.findOrThrow(user.uid);
    const paymentReceipt: PaymentReceipt = {
      ...new PaymentReceipt(),
      ...dto,
      userId: user.uid,
    };
    return await this.paymentReceiptRepository.create(paymentReceipt);
  }

  async markPaymentAsDone(dto: MarkPaymentAsDoneDto) {
    const paymentReceipt = await this.paymentReceiptRepository.findById(
      dto.paymentReceiptId,
    );
    if (!paymentReceipt) {
      throw new NotFoundException('Payment receipt not found!');
    }
    paymentReceipt.doneAt = new Date().toISOString();
    return await this.paymentReceiptRepository.update(paymentReceipt);
  }

  getPaymentReceipt(query: GetPaymentReceiptDto) {
    console.log({ query });

    const qb = query.isDone
      ? this.paymentReceiptRepository.whereNotEqualTo('doneAt', null)
      : this.paymentReceiptRepository.whereEqualTo('doneAt', null);
    return qb.find();
  }

  getPaymentInfo() {
    return {
      transferCode: '2|99|0374246292|NGUYEN KHA VI||0|0|0||transfer_myqr',
      accountHolder: 'Nguyễn Kha Vĩ',
      phoneNumber: '0374246292',
    };
  }
}
