import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { PhraseService } from '../phrase/phrase.service';
import { CategoryService } from '../category/category.service';
import { LevelService } from '../level/level.service';
import { QuestionService } from '../question/question.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';
import { GetTopicsDto } from './dto/get-topics.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { AlgoliaService } from 'src/algolia/algolia.service';
import { BookmarkService } from 'src/bookmark/bookmark.service';
import { UserRecord } from 'firebase-admin/auth';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: BaseFirestoreRepository<Topic>,
    private readonly levelService: LevelService,
    private readonly categoryService: CategoryService,
    private readonly questionService: QuestionService,
    private readonly phraseService: PhraseService,
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => AlgoliaService))
    private readonly algoliaService: AlgoliaService,
    @Inject(forwardRef(() => BookmarkService))
    private bookmarkService: BookmarkService,
  ) {
    // this.export();
    // this.import();
  }
  // async import() {
  //   const readContent: Topic[] = require('../../topics.json');
  //   console.log({ readContent });
  //   const resp = await Promise.all(
  //     readContent.map(async (item) => await this.topicRepository.create(item)),
  //   );
  //   console.log({ resp });
  // }
  // async export() {
  //   const topics = await this.topicRepository.find();
  //   const contentFile = JSON.stringify(topics);
  //   writeFileSync('./topics.json', contentFile);
  //   const readContent = require('../../topics.json');
  //   console.log({ readContent });
  // }
  async create(dto: CreateTopicDto) {
    return await this.topicRepository.create(dto);
  }

  async searchTopic(query: GetTopicsDto) {
    return this.algoliaService.searchTopic(query);
  }

  async getListTopic(query: GetTopicsDto, user: UserRecord) {
    console.log({ user });

    const { data: rawTopics = [] } = await (query.keyword
      ? this.searchTopic(query)
      : this.findAll(query));
    const promises = rawTopics.map(async (item) => {
      if (user) {
        const bookmark = await this.bookmarkService.isTopicExist(
          item.id,
          user.uid,
        );

        return {
          ...item,
          bookmark,
        };
      } else {
        return item;
      }
    });
    const data = await Promise.all(promises);
    return { data };
  }

  async findAll(query: GetTopicsDto) {
    const { levelId, categoryId, keyword } = query;

    let qb = levelId
      ? this.topicRepository.whereEqualTo('levelId', levelId)
      : this.topicRepository;

    if (categoryId) {
      qb = qb.whereEqualTo('categoryId', categoryId);
    }

    if (keyword) {
      qb = qb.whereGreaterOrEqualThan('name', keyword);
      qb = qb.whereLessOrEqualThan('name', keyword + 'z');
    }

    const list = (await qb.find()) || [];

    const data = [];
    for (const item of list) {
      const category = await this.categoryService.findOne(item.categoryId);
      data.push({
        ...item,
        category,
      });
    }
    return {
      data,
    };
  }

  async findOne(id: string, user?: UserRecord) {
    const topic = await this.topicRepository.findById(id);
    if (!topic) return null;
    const [level, category, questions = [], rawPhrases = [], topicBookmark] =
      await Promise.all([
        this.levelService.findOne(topic.levelId),
        this.categoryService.findOne(topic.categoryId),
        this.questionService.getQuestionsByTopic(topic.id),
        this.phraseService.getPhrasesByTopic(topic.id),
        this.bookmarkService.isTopicExist(id, user.uid),
      ]);

    const promises = rawPhrases.map(async (item) => {
      if (user) {
        const bookmark = await this.bookmarkService.isPhraseExist(
          item.id,
          user.uid,
        );

        return {
          ...item,
          bookmark,
        };
      } else {
        return item;
      }
    });
    const phrases = await Promise.all(promises);
    return {
      data: {
        ...topic,
        topicBookmark,
        level,
        category,
        questions,
        phrases,
      },
      meta: {
        id,
      },
    };
  }

  async findByIds(ids: string[]) {
    const topics = await this.topicRepository.whereIn('id', ids).find();
    if (!topics.length) return [];
    const promises = topics.map(async (topic) => {
      const level = await this.levelService.findOne(topic.levelId);
      const category = await this.categoryService.findOne(topic.categoryId);
      const questions =
        (await this.questionService.getQuestionsByTopic(topic.id)) || [];

      const phrases =
        (await this.phraseService.getPhrasesByTopic(topic.id)) || [];

      return {
        ...topic,
        level,
        category,
        questions,
        phrases,
      };
    });
    return await Promise.all(promises);
  }

  async update(id: string, dto: UpdateTopicDto) {
    const exist = await this.topicRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('category is not existed!');
    }
    return await this.topicRepository.update({
      ...exist,
      ...dto,
    });
  }

  async remove(id: string) {
    const exist = await this.topicRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('category is not existed!');
    }
    return await this.topicRepository.delete(id);
  }

  async getTopicsForIndex() {
    const list = await this.topicRepository.find();
    const data = [];
    for (const item of list) {
      const category = await this.categoryService.findOne(item.categoryId);
      data.push({
        ...item,
        category,
      });
    }
    return data;
  }

  findById(id: string) {
    return this.topicRepository.findById(id);
  }
}
