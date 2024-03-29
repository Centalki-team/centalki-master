import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { writeFileSync } from 'fs';
import { InjectRepository } from 'nestjs-fireorm';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: BaseFirestoreRepository<Level>,
  ) {
    // this.export();
    // this.import();
  }
  // async import() {
  //   const readContent: Level[] = require('../../levels.json');
  //   console.log({ readContent });
  //   const resp = await Promise.all(
  //     readContent.map((item) => this.levelRepository.create(item)),
  //   );
  //   console.log({ resp });
  // }
  // async export() {
  //   const levels = await this.levelRepository.find();
  //   const contentFile = JSON.stringify(levels);
  //   writeFileSync('./levels.json', contentFile);
  //   const readContent = require('../../levels.json');
  //   console.log({ readContent });
  // }
  async create(createLevelDto: CreateLevelDto) {
    const existByCode = await this.levelRepository
      .whereEqualTo('code', createLevelDto.code)
      .findOne();
    if (existByCode) {
      throw new ConflictException('Level code already existed!');
    }
    return await this.levelRepository.create(createLevelDto);
  }

  findAll() {
    return this.levelRepository.find();
  }

  findOne(id: string) {
    return this.levelRepository.findById(id);
  }

  async update(id: string, updateLevelDto: UpdateLevelDto) {
    const exist = await this.levelRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('Level is not existed!');
    }
    return await this.levelRepository.update({
      ...exist,
      ...updateLevelDto,
    });
  }

  async remove(id: string) {
    const exist = await this.levelRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('Level is not existed!');
    }
    return await this.levelRepository.delete(id);
  }
}
