import { Collection } from 'fireorm';

@Collection()
export class Category {
  id!: string;

  name: string;
}
