import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BaseFirestoreRepository,
  IFireOrmQueryLine,
  FirestoreOperators,
} from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { PhraseService } from '../phrase/phrase.service';
import { CategoryService } from '../category/category.service';
import { LevelService } from '../level/level.service';
import { QuestionService } from '../question/question.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';
import { GetTopicsDto } from './dto/get-topics.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: BaseFirestoreRepository<Topic>,
    private readonly levelService: LevelService,
    private readonly categoryService: CategoryService,
    private readonly questionService: QuestionService,
    private readonly phraseService: PhraseService,
    private readonly commonService: CommonService,
  ) {}
  async create(dto: CreateTopicDto) {
    return await this.topicRepository.create(dto);
  }

  async findAll(query: GetTopicsDto) {
    const { levelId, page, size } = query;
    const queries: IFireOrmQueryLine[] = [];
    if (levelId) {
      queries.push({
        prop: 'levelId',
        val: levelId,
        operator: FirestoreOperators.equal,
      });
    }

    const {
      data: list = [],
      hasNextPage,
      hasPrevPage,
    } = await this.commonService.find(
      this.topicRepository,
      queries,
      page,
      size,
      true,
      {
        fieldPath: 'id',
        directionStr: 'asc',
      },
    );

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
      meta: {
        ...query,
        queries,
        hasNextPage,
        hasPrevPage,
      },
    };
  }

  async findOne(id: string) {
    const topic = await this.topicRepository.findById(id);
    const level = await this.levelService.findOne(topic.levelId);
    const category = await this.categoryService.findOne(topic.categoryId);
    const questions =
      (await this.questionService.getQuestionsByTopic(topic.id)) || [];

    const phrases =
      (await this.phraseService.getPhrasesByTopic(topic.id)) || [];

    return {
      data: {
        ...topic,
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
}
