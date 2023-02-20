import { Collection } from 'fireorm';

@Collection()
export class Transaction {
  id!: string;

  userId?: string = null; // In case session completed

  sessionId?: string = null; // In case session completed

  amount: number;

  createdAt: string;
}
