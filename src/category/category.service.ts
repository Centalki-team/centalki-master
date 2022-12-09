import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: BaseFirestoreRepository<Category>,
  ) {}
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
