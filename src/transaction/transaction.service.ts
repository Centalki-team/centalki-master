import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRecord } from 'firebase-admin/auth';
import * as iap from 'in-app-purchase';
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
import { AppleVerifyPurchaseDto } from 'src/transaction/dto/apple-verify-purchase.dto';
import { StoreReceipt } from 'src/transaction/entities/store-receipt.entity';

@Injectable()
@ApiTags('Giao dịch')
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: BaseFirestoreRepository<Transaction>,

    @InjectRepository(PaymentReceipt)
    private paymentReceiptRepository: BaseFirestoreRepository<PaymentReceipt>,

    @InjectRepository(StoreReceipt)
    private storeReceiptRepository: BaseFirestoreRepository<StoreReceipt>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private commonService: CommonService,
    private fcmService: FcmService,
    private notificationService: NotificationService,
  ) {
    iap.config({
      /* Configurations for HTTP request */
      // requestDefaults: {
      //   /* Please refer to the request module documentation here: https://www.npmjs.com/package/request#requestoptions-callback */
      // },

      /* Configurations for Amazon Store */
      // amazonAPIVersion: 2, // tells the module to use API version 2
      // secret: 'abcdefghijklmnoporstuvwxyz', // this comes from Amazon
      // amazonValidationHost: http://localhost:8080/RVSSandbox, // Local sandbox URL for testing amazon sandbox receipts.

      /* Configurations for Apple */
      appleExcludeOldTransactions: true, // if you want to exclude old transaction, set this to true. Default is false
      applePassword: process.env.APPLE_STORE_SHARE_SECRET, // this comes from iTunes Connect (You need this to valiate subscriptions)

      /* Configurations for Google Service Account validation: You can validate with just packageName, productId, and purchaseToken */
      googleServiceAccount: {
        clientEmail: process.env.GG_PURCHASE_VERIFIER_EMAIL,
        privateKey: process.env.GG_PURCHASE_VERIFIER_PRIVATE_KEY.replace(
          /\\n/g,
          '\n',
        ),
      },

      /* Configurations for Google Play */
      // googlePublicKeyPath: 'path/to/public/key/directory/', // this is the path to the directory containing iap-sanbox/iap-live files
      // googlePublicKeyStrSandBox: 'publicKeySandboxString', // this is the google iap-sandbox public key string
      // googlePublicKeyStrLive: 'publicKeyLiveString', // this is the google iap-live public key string
      // googleAccToken: 'abcdef...', // optional, for Google Play subscriptions
      // googleRefToken: 'dddd...', // optional, for Google Play subscritions
      // googleClientID: 'aaaa', // optional, for Google Play subscriptions
      // googleClientSecret: 'bbbb', // optional, for Google Play subscriptions
    });
  }

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
    const momo = {
      transferCode: '2|99|0374246292|NGUYEN KHA VI||0|0|0||transfer_myqr',
      accountHolder: 'Nguyễn Kha Vĩ',
      phoneNumber: '0374246292',
    };
    const banking = {
      accountHolder: 'Nguyễn Kha Vĩ',
      accountNumber: '0374246292',
      bank: 'MB Bank',
    };
    return { momo, banking };
  }

  async appleVerifyPurchase(data: AppleVerifyPurchaseDto, user: UserRecord) {
    try {
      await iap.setup();
      const validatedData = await iap.validate(data.verificationData);
      console.log({ validatedData });

      const AMOUNT_MAP = {
        'com.centalki.app.one_session': 100_000,
        'com.centalki.app.six_session': 600_000,
      };
      await this.createTransaction(user.uid, AMOUNT_MAP[data.productId]);
      await this.storeReceiptRepository.create({
        createdAt: new Date().getTime(),
        productId: data.productId,
        userId: user.uid,
        verificationData: data.verificationData,
        service: iap.APPLE,
      });
    } catch (err) {
      console.log({ err });
      throw new BadRequestException('Verify fails');
    }
  }

  async googleVerifyPurchase(data: AppleVerifyPurchaseDto, user: UserRecord) {
    try {
      await iap.setup();
      const validatedData = await iap.validate({
        packageName: 'com.centalki.student',
        productId: data.productId,
        purchaseToken: data.verificationData,
        subscription: false, // if the receipt is a subscription, then true
      });
      console.log({ googleVerifyPurchase: validatedData });

      const AMOUNT_MAP = {
        'com.centalki.app.one_session': 100_000,
        'com.centalki.app.six_session': 600_000,
      };
      await this.createTransaction(user.uid, AMOUNT_MAP[data.productId]);
      await this.storeReceiptRepository.create({
        createdAt: new Date().getTime(),
        productId: data.productId,
        userId: user.uid,
        verificationData: data.verificationData,
        service: iap.GOOGLE,
      });
    } catch (err) {
      console.log({ err });
      throw new BadRequestException('Verify fails');
    }
  }
}
