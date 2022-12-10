import { Module } from '@nestjs/common';
import admin from 'firebase-admin';
import { AuthModule } from './auth/auth.module';
import { FireormModule } from 'nestjs-fireorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';
import { CommonModule } from './common/common.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { LevelModule } from './level/level.module';
import { CategoryModule } from './category/category.module';
import { TopicModule } from './topic/topic.module';
import { QuestionModule } from './question/question.module';
import { PhraseModule } from './phrase/phrase.module';
const RENDER_PATH = '/etc/secrets/service-account-file.json';
const LOCAL_PATH =
  '/Users/admin/Documents/centalki/centalki-master/service-account-file.json';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const accountService = require(RENDER_PATH);

admin.initializeApp({
  credential: admin.credential.cert(accountService),
  storageBucket: 'centalki-staging.appspot.com',
});
const firestore = admin.firestore();
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './env',
    }),
    CommonModule,
    FireormModule.forRoot({
      fireormSettings: { validateModels: false },
      firestore,
    }),
    AuthModule,
    StorageModule,
    FirebaseModule,
    LevelModule,
    CategoryModule,
    TopicModule,
    QuestionModule,
    PhraseModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
