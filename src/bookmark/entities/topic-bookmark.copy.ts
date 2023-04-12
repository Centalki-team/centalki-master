import { Collection } from 'fireorm';

@Collection()
export class TopicBookmark {
  id!: string;

  topicId: string;

  userId: string;

  createdAt: string;
}
