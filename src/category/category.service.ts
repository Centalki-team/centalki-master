import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
// import { writeFileSync, readFileSync } from 'fs';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: BaseFirestoreRepository<Category>,
  ) {
    // this.exportCategories();
    // this.import();
  }
  // async exportCategories() {
  //   const categories = await this.categoryRepository.find();
  //   const contentFile = JSON.stringify(categories);
  //   writeFileSync('./categories.json', contentFile);
  //   const readContent = require('../../categories.json');
  //   console.log({ readContent });
  // }
  // async import() {
  //   const readContent: Category[] = require('../../categories.json');
  //   console.log({ readContent });
  //   const resp = await Promise.all(
  //     readContent.map((item) => this.categoryRepository.create(item)),
  //   );
  //   console.log({ resp });
  // }
  async create(dto: CreateCategoryDto) {
    return await this.categoryRepository.create(dto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: string) {
    return this.categoryRepository.findById(id);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const exist = await this.categoryRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('category is not existed!');
    }
    return await this.categoryRepository.update({
      ...exist,
      ...dto,
    });
  }

  async remove(id: string) {
    const exist = await this.categoryRepository.findById(id);
    if (!exist) {
      throw new NotFoundException('category is not existed!');
    }
    return await this.categoryRepository.delete(id);
  }
}
