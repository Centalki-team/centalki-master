export class CreateNotificationDto {
  uid: string;

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
}
