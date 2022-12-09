import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: BaseFirestoreRepository<Question>,
  ) {}
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
