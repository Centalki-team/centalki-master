import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FcmService } from './fcm.service';

@Module({
  imports: [FirebaseModule],
  providers: [FcmService],
})
export class FcmModule {}
