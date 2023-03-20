import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreatePresignedUrlDto } from './dto/create-presigned-url.dto';

@Injectable()
export class StorageService {
  constructor(private readonly firebaseService: FirebaseService) {}
  generateV4UploadSignedUrl(dto: CreatePresignedUrlDto) {
    const expires = Date.now() + 5 * 60 * 1000;
    return this.firebaseService
      .storage()
      .bucket('media')
      .file(dto.filename)
      .getSignedUrl({
        version: 'v4',
        action: 'write',
        expires, // 15 minutes
        contentType: dto.contentType,
      })
      .then((data) => {
        if (!data.length) {
          throw new InternalServerErrorException();
        }
        return {
          meta: {
            expires,
            version: 'v4',
            ...dto,
          },
          data: data.length ? data[0] : null,
        };
      });
  }
}
