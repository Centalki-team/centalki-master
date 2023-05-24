import { Collection } from 'fireorm';

@Collection()
export class StoreReceipt {
  id!: string;

  productId: string;

  userId: string;

  service: string;

  verificationData: string;

  createdAt: number;
}
