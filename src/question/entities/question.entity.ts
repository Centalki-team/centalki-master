import { Collection } from 'fireorm';
import { Answer } from 'src/topic/dto/create-topic.dto';

@Collection()
export class Question {
  id!: string;

  topicId: string;

  question: string;

  answers: Answer[];
}
