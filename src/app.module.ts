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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, baseUrlConfig],
      envFilePath: ['.env'],
    }),
    FirebaseModule.register(),
    AuthModule,
    StorageModule,
    LevelModule,
    CategoryModule,
    TopicModule,
    QuestionModule,
    PhraseModule,
    SessionScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
