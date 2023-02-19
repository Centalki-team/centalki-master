import { forwardRef, Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthCollection } from './collection/auth.collection';
import { PassportModule } from '@nestjs/passport';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserProfile } from './collection/user-profile';
import { SessionScheduleModule } from 'src/session-schedule/session-schedule.module';
import { CertificateModule } from 'src/certificate/certificate.module';

@Module({
  imports: [
    FireormModule.forFeature([AuthCollection, UserProfile]),
    PassportModule,
    FirebaseModule,
    forwardRef(() => SessionScheduleModule),
    forwardRef(() => CertificateModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
