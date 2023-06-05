import { CacheModule, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SessionScheduleModule } from 'src/session-schedule/session-schedule.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    SessionScheduleModule,
    FirebaseModule,
    TeacherModule,
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
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
