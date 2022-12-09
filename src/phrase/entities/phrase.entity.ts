import { Collection } from 'fireorm';
import { Timestamp } from '../../global/class';
import { IExample } from '../interface/example.interface';

@Collection()
export class Phrase extends Timestamp {
  id!: string;

  topicId: string;

  phrase: string;

  meanings?: string[];

  phonetic?: string;

  examples: IExample[];
}
