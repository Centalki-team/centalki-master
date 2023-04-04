import { UserRecord } from 'firebase-admin/auth';
import { Collection } from 'fireorm';

@Collection()
export class Blocking {
  id!: string;

  userId: string;
  user?: UserRecord;

  blockedId: string;
  blocked?: UserRecord;

  createdAt: string;
}
