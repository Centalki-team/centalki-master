import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthCollection } from './collection/auth.collection';
import { PassportModule } from '@nestjs/passport';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserProfile } from './collection/user-profile';

@Module({
  imports: [
    FireormModule.forFeature([AuthCollection, UserProfile]),
    PassportModule,
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
