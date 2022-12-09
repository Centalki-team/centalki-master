import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { DictionaryService } from '../dictionary/dictionary.service';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';
import { Phrase } from './entities/phrase.entity';

@Injectable()
export class PhraseService {
  constructor(
    @InjectRepository(Phrase)
    private phraseRepository: BaseFirestoreRepository<Phrase>,
    private dictionaryService: DictionaryService,
  ) {}
  async create(dto: CreatePhraseDto) {
    const { phrase, topicId } = dto;

    const meanings = await this.dictionaryService.getMeaningByPrase([phrase]);
    const phonetic = await this.dictionaryService.getPhoneticByPrase(phrase);
    const examples = await this.dictionaryService.getExamples(phrase);

    return await this.phraseRepository.create({
      phrase,
      meanings,
      topicId,
      phonetic,
      examples,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  findAll() {
    return this.phraseRepository.orderByDescending('createdAt').find();
  }

  getPhrasesByTopic(topicId: string) {
    return this.phraseRepository
      .whereEqualTo('topicId', topicId)
      .orderByAscending('createdAt')
      .find();
  }

  findOne(id: string) {
    return this.phraseRepository.findById(id);
  }

  async update(id: string, dto: UpdatePhraseDto) {
    const exist = await this.phraseRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('phrase is not existed!');
    }
    return await this.phraseRepository.update({
      ...exist,
      ...dto,
    });
  }

  async remove(id: string) {
    const exist = await this.phraseRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('phrase is not existed!');
    }
    return await this.phraseRepository.delete(id);
  }
}
