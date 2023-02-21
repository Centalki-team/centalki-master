import { Injectable } from '@nestjs/common';
import {
  Message,
  MulticastMessage,
} from 'firebase-admin/lib/messaging/messaging-api';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FcmService {
  constructor(private firebaseService: FirebaseService) {}

  send(message: Message) {
    return this.firebaseService.message().send(message);
  }

  sendMulticast(message: MulticastMessage) {
    return this.firebaseService.message().sendMulticast(message);
  }
}
