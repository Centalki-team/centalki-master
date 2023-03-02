import { Collection } from 'fireorm';

@Collection()
export class Notification {
  id!: string;

  uid!: string;

  data?: {
    [key: string]: string;
  };

  title: {
    en: string;
    vi?: string;
  };

  body: {
    en: string;
    vi?: string;
  };

  imageUrl?: string;

  createdAt: string;

  seenAt: string | null;
}
