import { Module, forwardRef } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { FireormModule } from 'nestjs-fireorm';
import { VocabBookmark } from 'src/bookmark/entities/vocab-bookmark.entity';
import { PhraseModule } from 'src/phrase/phrase.module';
import { TopicBookmark } from 'src/bookmark/entities/topic-bookmark.copy';
import { TopicModule } from 'src/topic/topic.module';

@Module({
  imports: [
    FireormModule.forFeature([VocabBookmark, TopicBookmark]),
    PhraseModule,
    forwardRef(() => TopicModule),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
  exports: [BookmarkService],
})
export class BookmarkModule {}
