import { Collection } from 'fireorm';

@Collection()
export class VocabBookmark {
  id!: string;

  phraseId: string;

  userId: string;

  createdAt: string;
}
