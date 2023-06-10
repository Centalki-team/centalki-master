import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { GetUsersResult, UserIdentifier } from 'firebase-admin/auth';
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

  message() {
    return admin.messaging();
  }
  async getUsers(ids: UserIdentifier[]) {
    if (!ids.length) {
      return [];
    }
    const batches = [];

    while (ids.length) {
      // firestore limits batches to 100
      const batch = ids.splice(0, 99);

      // add the batch request to to a queue
      batches.push(
        this.auth()
          .getUsers(batch)
          .then((resp) => resp.users || []),
      );
    }

    const resp = await Promise.all(batches);
    const data = resp.flat() as GetUsersResult['users'];
    return data;
  }
}
