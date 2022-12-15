import { DynamicModule, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import admin from 'firebase-admin';
import { FireormModule } from 'nestjs-fireorm';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  static register(): DynamicModule {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const accountService = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

    admin.initializeApp({
      credential: admin.credential.cert(accountService),
      storageBucket: `${accountService.project_id}.appspot.com`,
    });

    return {
      global: true,
      module: FirebaseModule,
      providers: [FirebaseService],
      exports: [FirebaseService],
      imports: [
        FireormModule.forRoot({
          fireormSettings: { validateModels: false },
          firestore: admin.firestore(),
        }),
      ],
    };
  }
}
