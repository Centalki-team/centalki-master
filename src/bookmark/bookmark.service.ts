import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { InjectRepository } from 'nestjs-fireorm';
import { VocabBookmark } from 'src/bookmark/entities/vocab-bookmark.entity';
import { BaseFirestoreRepository } from 'fireorm';
import { UserRecord } from 'firebase-admin/auth';
import { PhraseService } from 'src/phrase/phrase.service';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(VocabBookmark)
    private vocabBookmarkRepository: BaseFirestoreRepository<VocabBookmark>,
    private phraseService: PhraseService,
  ) {}
  async create(dto: CreateBookmarkDto, user: UserRecord) {
    const bookmark = await this.vocabBookmarkRepository
      .whereEqualTo('userId', user.uid)
      .whereEqualTo('phraseId', dto.phraseId)
      .findOne();
    if (bookmark) {
      return bookmark;
    }

    const phrase = await this.phraseService.findOne(dto.phraseId);
    if (!phrase) {
      throw new NotFoundException('Phrase not found!');
    }

    return await this.vocabBookmarkRepository.create({
      userId: user.uid,
      phraseId: dto.phraseId,
      createdAt: new Date().toISOString(),
    });
  }

  async findAll(user: UserRecord) {
    return this.vocabBookmarkRepository
      .whereEqualTo('userId', user.uid)
      .find()
      .then((list) => {
        return Promise.all(
          list.map(async (bookmark) => {
            const phrase = await this.phraseService.findOne(bookmark.phraseId);
            return {
              ...bookmark,
              phrase,
            };
          }),
        );
      });
  }

  async findOne(id: string) {
    const vocabBookmark = await this.vocabBookmarkRepository.findById(id);
    if (!vocabBookmark) {
      throw new NotFoundException('Bookmark not found!');
    }
    const phrase = await this.phraseService.findOne(vocabBookmark.phraseId);
    if (!phrase) {
      throw new NotFoundException('Phrase not found!');
    }
    return {
      ...vocabBookmark,
      phrase,
    };
  }

  // update(id: string, updateBookmarkDto: UpdateBookmarkDto) {
  //   const vocabBookmark = await this.vocabBookmarkRepository.findOne(id);
  //   return `This action updates a #${id} bookmark`;
  // }

  async remove(id: string, user: UserRecord) {
    const vocabBookmark = await this.vocabBookmarkRepository.findById(id);
    if (vocabBookmark.userId !== user.uid) {
      throw new ForbiddenException('Owner can delete only!');
    }

    return await this.vocabBookmarkRepository.delete(id);
  }
}
