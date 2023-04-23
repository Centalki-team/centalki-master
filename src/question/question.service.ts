import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

class Question1 {
  id!: string;

  topicId: string;

  question: string;

  answers: string[];
}
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: BaseFirestoreRepository<Question>,
  ) {
    // this.export();
    // this.import();
    // this.updateQuestionFromJson();
  }
  // async import() {
  //   const readContent: Question[] = require('../../questions.json');
  //   console.log({ readContent });
  //   const resp = await Promise.all(
  //     readContent.map(
  //       async (item) => await this.questionRepository.create(item),
  //     ),
  //   );
  //   console.log({ resp });
  // }
  // async export() {
  //   const questions = await this.questionRepository.find();
  //   const contentFile = JSON.stringify(questions);
  //   writeFileSync('./questions.json', contentFile);
  //   const readContent = require('../../questions.json');
  //   console.log({ readContent });
  // }

  // async updateQuestionFromJson() {
  //   const readContent: Question1[] = require('../../B2_Questions/B2 - Urban Life.json');
  //   console.log({ readContent });
  //   const resp = await Promise.all(
  //     readContent.map(
  //       async (item) => await this.questionRepository.create(item),
  //     ),
  //   );
  //   console.log({ resp });
  // }

  async create(dto: CreateQuestionDto) {
    return await this.questionRepository.create(dto);
  }

  findAll() {
    return this.questionRepository.find();
  }

  getQuestionsByTopic(topicId: string) {
    return this.questionRepository.whereEqualTo('topicId', topicId).find();
  }

  findOne(id: string) {
    return this.questionRepository.findById(id);
  }

  async update(id: string, dto: UpdateQuestionDto) {
    const exist = await this.questionRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('question is not existed!');
    }
    return await this.questionRepository.update({
      ...exist,
      ...dto,
    });
  }

  async remove(id: string) {
    const exist = await this.questionRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('question is not existed!');
    }
    return await this.questionRepository.delete(id);
  }
}
