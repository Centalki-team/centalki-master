import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
// import { FieldValue } from 'firebase-admin/firestore';
import { InjectRepository } from 'nestjs-fireorm';
import { CommonService } from 'src/common/common.service';
import { PaginationResult } from 'src/global/types';
import { DictionaryService } from '../dictionary/dictionary.service';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { GetPhrasesDto } from './dto/get-phrases.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';
import { Phrase } from './entities/phrase.entity';

@Injectable()
export class PhraseService {
  constructor(
    @InjectRepository(Phrase)
    private phraseRepository: BaseFirestoreRepository<Phrase>,
    private dictionaryService: DictionaryService,
    private commonService: CommonService,
  ) {
    // const clothesJSON: Phrase[] = require('../../data/A02 - Clothes.json');
    // const foodsJSON: Phrase[] = require('../../data/A02 - Foods.json');
    // const moviesJSON: Phrase[] = require('../../data/A02 - Movies.json');
    // const activitiesJSON: Phrase[] = require('../../data/A02 - Weekend Activities.json');
    // const json = [foodsJSON, clothesJSON, moviesJSON, activitiesJSON].flat();
    // const randomItem = json[0];
    // console.log({ randomItem });
    // this.phraseRepository.find().then((phrases) => {
    //   console.log({ phrases });
    //   for (const phrase of phrases) {
    //     const newData = json.find((item) => item.id === phrase.id);
    //     phrase.examples = newData ? newData.examples : randomItem.examples;
    //     phrase.translations = newData
    //       ? newData.translations
    //       : randomItem.translations;
    //     // phrase.meanings = FieldValue.delete();
    //     this.phraseRepository.update(phrase);
    //     console.log(`Update success`, phrase);
    //   }
    // });
    // this.export();
    // this.import();
    // this.updatePhraseFromJson();
  }
  // async import() {
  //   const readContent: Phrase[] = require('../../phrases.json');
  //   console.log({ readContent });
  //   const resp = await Promise.all(
  //     readContent.map(async (item) => await this.phraseRepository.create(item)),
  //   );
  //   console.log({ resp });
  // }
  // async export() {
  //   const phrases = await this.phraseRepository.find();
  //   const contentFile = JSON.stringify(phrases);
  //   writeFileSync('./phrases.json', contentFile);
  //   const readContent = require('../../phrases.json');
  //   console.log({ readContent });
  // }
  // async updatePhraseFromJson() {
  //   const readContent: Phrase[] = require('../../B2/Vocabs/B2 - Sustainable Fashion.json');
  //   console.log({ readContent });
  //   await Promise.all(
  //     readContent.map(async (item) => {
  //       const { phrase, topicId, translations, examples, phonetic } = item;
  //       await this.phraseRepository.create({
  //         phrase,
  //         translations,
  //         topicId,
  //         phonetic,
  //         examples,
  //         createdAt: new Date().toISOString(),
  //         updatedAt: new Date().toISOString(),
  //       });
  //     }),
  //   );   
  // }
  async create(dto: CreatePhraseDto) {
    const { phrase, topicId, translations, examples } = dto;

    const phonetic = await this.dictionaryService.getPhoneticByPrase(phrase);

    return await this.phraseRepository.create({
      phrase,
      translations,
      topicId,
      phonetic,
      examples,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async findAll(query: GetPhrasesDto): Promise<PaginationResult<Phrase>> {
    const { page, size } = query;

    const { data, hasNextPage, hasPrevPage } = await this.commonService.find(
      this.phraseRepository,
      [],
      page,
      size,
    );

    return {
      meta: {
        hasNextPage,
        hasPrevPage,
        page,
        size,
      },
      data,
    };
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
