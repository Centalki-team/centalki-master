import { Injectable } from '@nestjs/common';
import { CreateTopicAdviseDto } from './dto/create-topic-advise.dto';
import { UserRecord } from 'firebase-admin/auth';
import { TopicAdvise } from 'src/topic-advise/entities/topic-advise.entity';
import { InjectRepository } from 'nestjs-fireorm';
import { BaseFirestoreRepository } from 'fireorm';

@Injectable()
export class TopicAdviseService {
  constructor(
    @InjectRepository(TopicAdvise)
    private readonly topicAdviseRepository: BaseFirestoreRepository<TopicAdvise>,
  ) {}
  create(createTopicAdviseDto: CreateTopicAdviseDto, user: UserRecord) {
    return this.topicAdviseRepository.create({
      ...createTopicAdviseDto,
      userId: user.uid,
    });
  }
}
