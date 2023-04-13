import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { InjectRepository } from 'nestjs-fireorm';
import { VocabBookmark } from 'src/bookmark/entities/vocab-bookmark.entity';
import { BaseFirestoreRepository } from 'fireorm';
import { UserRecord } from 'firebase-admin/auth';
import { PhraseService } from 'src/phrase/phrase.service';
import { CreateTopicBookmarkDto } from 'src/bookmark/dto/create-topic-bookmark.dto';
import { TopicBookmark } from 'src/bookmark/entities/topic-bookmark.copy';
import { TopicService } from 'src/topic/topic.service';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(VocabBookmark)
    private vocabBookmarkRepository: BaseFirestoreRepository<VocabBookmark>,
    @InjectRepository(TopicBookmark)
    private topicBookmarkRepository: BaseFirestoreRepository<TopicBookmark>,
    private phraseService: PhraseService,
    @Inject(forwardRef(() => TopicService))
    private topicService: TopicService,
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

  async createTopicBookmark(dto: CreateTopicBookmarkDto, user: UserRecord) {
    const bookmark = await this.topicBookmarkRepository
      .whereEqualTo('userId', user.uid)
      .whereEqualTo('topicId', dto.topicId)
      .findOne();
    if (bookmark) {
      return bookmark;
    }

    const topic = await this.topicService.findById(dto.topicId);
    if (!topic) {
      throw new NotFoundException('Topic not found!');
    }

    return await this.topicBookmarkRepository.create({
      userId: user.uid,
      topicId: dto.topicId,
      createdAt: new Date().toISOString(),
    });
  }

  async removeTopicBookmark(id: string, user: UserRecord) {
    const topicBookmark = await this.topicBookmarkRepository.findById(id);
    if (topicBookmark.userId !== user.uid) {
      throw new ForbiddenException('Owner can delete only!');
    }

    return await this.topicBookmarkRepository.delete(id);
  }

  async findOneTopicBookmark(id: string) {
    const topicBookmark = await this.topicBookmarkRepository.findById(id);
    if (!topicBookmark) {
      throw new NotFoundException('Bookmark not found!');
    }
    const topic = await this.topicService.findOne(topicBookmark.topicId);
    if (!topic) {
      throw new NotFoundException('Topic not found!');
    }
    return {
      ...topicBookmark,
      topic,
    };
  }

  async findAllTopicBookmark(user: UserRecord) {
    return this.topicBookmarkRepository
      .whereEqualTo('userId', user.uid)
      .find()
      .then((list) => {
        return Promise.all(
          list.map(async (bookmark) => {
            const topic = await this.topicService.findOne(bookmark.topicId);
            return {
              ...bookmark,
              topic,
            };
          }),
        );
      });
  }

  async isPhraseExist(phraseId: string, uid: string) {
    const bookmark = await this.vocabBookmarkRepository
      .whereEqualTo('userId', uid)
      .whereEqualTo('phraseId', phraseId)
      .findOne();
    return bookmark;
  }

  async isTopicExist(topicId: string, uid: string) {
    const bookmark = await this.topicBookmarkRepository
      .whereEqualTo('userId', uid)
      .whereEqualTo('topicId', topicId)
      .findOne();
    return bookmark;
  }
}
