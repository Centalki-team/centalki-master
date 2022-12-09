import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';
@Injectable()
export class AppService {
  constructor(private readonly firebaseService: FirebaseService) {}
  sayHello() {
    return this.firebaseService.auth().listUsers();
  }
}
