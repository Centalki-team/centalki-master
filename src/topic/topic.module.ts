import { CacheModule, Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Topic } from './entities/topic.entity';
import { CategoryModule } from '../category/category.module';
import { QuestionModule } from '../question/question.module';
import { LevelModule } from '../level/level.module';
import { PhraseModule } from '../phrase/phrase.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    FireormModule.forFeature([Topic]),
    CategoryModule,
    QuestionModule,
    LevelModule,
    PhraseModule,
    FirebaseModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          url: configService.get('redisURI'),
          isGlobal: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
