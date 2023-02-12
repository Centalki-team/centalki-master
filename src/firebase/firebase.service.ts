import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
@Injectable()
export class FirebaseService {
  admin() {
    return admin;
  }
  auth() {
    return admin.auth();
  }

  storage() {
    return admin.storage();
  }

  firestore() {
    return admin.firestore();
  }

  realTimeDatabase() {
    return admin.database();
  }
}
