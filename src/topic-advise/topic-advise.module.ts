import { Module } from '@nestjs/common';
import { TopicAdviseService } from './topic-advise.service';
import { TopicAdviseController } from './topic-advise.controller';
import { FireormModule } from 'nestjs-fireorm';
import { TopicAdvise } from 'src/topic-advise/entities/topic-advise.entity';

@Module({
  imports: [FireormModule.forFeature([TopicAdvise])],
  controllers: [TopicAdviseController],
  providers: [TopicAdviseService],
})
export class TopicAdviseModule {}
