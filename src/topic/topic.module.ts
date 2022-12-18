import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Topic } from './entities/topic.entity';
import { CategoryModule } from '../category/category.module';
import { QuestionModule } from '../question/question.module';
import { LevelModule } from '../level/level.module';
import { PhraseModule } from '../phrase/phrase.module';

@Module({
  imports: [
    FireormModule.forFeature([Topic]),
    CategoryModule,
    QuestionModule,
    LevelModule,
    PhraseModule,
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
