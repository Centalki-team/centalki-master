import { UserRecord } from 'firebase-admin/auth';
import { Collection } from 'fireorm';

@Collection()
export class Reporting {
  id!: string;

  userId: string;
  user?: UserRecord;

  reportedId: string;
  reported?: UserRecord;

  summary?: string;
  detail?: string;

  createdAt: string;
}
