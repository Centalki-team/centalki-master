import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
@Injectable()
export class FirebaseService {
  auth() {
    return admin.auth();
  }

  storage() {
    return admin.storage();
  }

  firestore() {
    return admin.firestore();
  }
}
