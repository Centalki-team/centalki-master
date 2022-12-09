import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthCollection } from './collection/auth.collection';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from './firebase.strategy';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    FireormModule.forFeature([AuthCollection]),
    PassportModule,
    FirebaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy],
  exports: [FirebaseStrategy],
})
export class AuthModule {}
