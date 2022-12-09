import { Collection } from 'fireorm';

@Collection()
export class Level {
  id!: string;

  name: string;

  code: string;
}
