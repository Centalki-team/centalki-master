import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [FireormModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
