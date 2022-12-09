import { Collection } from 'fireorm';

@Collection()
export class Topic {
  id!: string;

  levelId: string;

  categoryId: string;

  name: string;

  description: string;

  imageURL: string;
}
