import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { LevelModule } from './level/level.module';
import { CategoryModule } from './category/category.module';
import { TopicModule } from './topic/topic.module';
import { QuestionModule } from './question/question.module';
import { PhraseModule } from './phrase/phrase.module';
import { SessionScheduleModule } from './session-schedule/session-schedule.module';
import appConfig from './config/app.config';
import baseUrlConfig from './config/base-url.config';
import algoliaConfig from './config/algolia.config';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { FeedbackModule } from './feedback/feedback.module';
import { FcmModule } from './fcm/fcm.module';
import { CertificateModule } from './certificate/certificate.module';
import { CacheManagerModule } from './cache-manager/cache-manager.module';
import { TransactionModule } from './transaction/transaction.module';
import { NotificationModule } from './notification/notification.module';
import { AdminModule } from './admin/admin.module';
import { BlockingModule } from './blocking/blocking.module';
import { ReportingModule } from 'src/reporting/reporting.module';
import { AlgoliaModule } from './algolia/algolia.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { TopicAdviseModule } from './topic-advise/topic-advise.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, baseUrlConfig, algoliaConfig],
      envFilePath: ['.env'],
    }),
    CacheManagerModule,
    FirebaseModule.register(),
    EventEmitterModule.forRoot(),
    AuthModule,
    StorageModule,
    LevelModule,
    CategoryModule,
    TopicModule,
    QuestionModule,
    PhraseModule,
    SessionScheduleModule,
    FeedbackModule,
    FcmModule,
    CertificateModule,
    CacheManagerModule,
    TransactionModule,
    NotificationModule,
    AdminModule,
    BlockingModule,
    ReportingModule,
    AlgoliaModule,
    BookmarkModule,
    TopicAdviseModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
