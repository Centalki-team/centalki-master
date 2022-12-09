import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Question } from './entities/question.entity';

@Module({
  imports: [FireormModule.forFeature([Question])],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
