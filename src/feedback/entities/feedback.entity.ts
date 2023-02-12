import { UserRecord } from 'firebase-admin/auth';
import { Collection } from 'fireorm';

@Collection()
export class Feedback {
  id!: string;

  rating: number;

  userId: string;
  user?: UserRecord;

  text: string;
}
