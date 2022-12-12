import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CommonService } from './common.service';
// import admin from 'firebase-admin';
// import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';

@Module({
  imports: [FirebaseModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
