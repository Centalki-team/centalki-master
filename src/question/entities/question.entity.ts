import { Collection } from 'fireorm';

@Collection()
export class Question {
  id!: string;

  topicId: string;

  question: string;
}
