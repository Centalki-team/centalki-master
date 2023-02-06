import { Collection } from 'fireorm';
import { Timestamp } from '../../global/class';
import { IExample, ITranslation } from '../interface/example.interface';

@Collection()
export class Phrase extends Timestamp {
  id!: string;

  topicId: string;

  phrase: string;

  translations?: ITranslation[];

  phonetic?: string;

  examples: IExample[];
}
