import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthCollection } from './collection/auth.collection';
import { PassportModule } from '@nestjs/passport';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserProfile } from './collection/user-profile';
import { SessionScheduleModule } from 'src/session-schedule/session-schedule.module';
import { CertificateModule } from 'src/certificate/certificate.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { TopicModule } from 'src/topic/topic.module';

@Module({
  imports: [
    FireormModule.forFeature([AuthCollection, UserProfile]),
    PassportModule,
    FirebaseModule,
    TopicModule,
    forwardRef(() => SessionScheduleModule),
    forwardRef(() => CertificateModule),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          url: configService.get('redisURI'),
          isGlobal: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
