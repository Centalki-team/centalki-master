import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FcmService } from './fcm.service';

@Module({
  imports: [FirebaseModule],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule {}
