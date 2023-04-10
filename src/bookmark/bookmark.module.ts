import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { FireormModule } from 'nestjs-fireorm';
import { VocabBookmark } from 'src/bookmark/entities/vocab-bookmark.entity';
import { PhraseModule } from 'src/phrase/phrase.module';

@Module({
  imports: [FireormModule.forFeature([VocabBookmark]), PhraseModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
