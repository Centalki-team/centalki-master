import { Injectable } from '@nestjs/common';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FcmService {
  constructor(private firebaseService: FirebaseService) {}

  send(message: Message) {
    return this.firebaseService.message().send(message);
  }
}
