import { Collection } from 'fireorm';
import { EDifficulty } from 'src/topic-advise/enum/difficulty.enum';

@Collection()
export class TopicAdvise {
  id!: string;

  subject: string;
  description: string;

  difficulty: EDifficulty;

  userId: string;
}
