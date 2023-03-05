import { Collection } from 'fireorm';

@Collection()
export class PaymentReceipt {
  id!: string;

  userId: string = null;

  imageURLs: string[] = null;

  doneAt: string = null;

  createdAt: string = new Date().toISOString();
}
