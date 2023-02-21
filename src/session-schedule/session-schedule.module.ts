import { forwardRef, Module } from '@nestjs/common';
import { SessionScheduleService } from './session-schedule.service';
import { SessionScheduleController } from './session-schedule.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FireormModule } from 'nestjs-fireorm';
import { SessionSchedule } from './entities/session-schedule.entity';
import { TopicModule } from 'src/topic/topic.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { CacheManagerModule } from 'src/cache-manager/cache-manager.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionModule } from 'src/transaction/transaction.module';
import { FcmModule } from 'src/fcm/fcm.module';

@Module({
  imports: [
    FireormModule.forFeature([SessionSchedule]),
    FirebaseModule,
    TopicModule,
    forwardRef(() => AuthModule),
    CacheManagerModule,
    CommonModule,
    ScheduleModule.forRoot(),
    TransactionModule,
    FcmModule,
  ],
  controllers: [SessionScheduleController],
  providers: [SessionScheduleService],
  exports: [SessionScheduleService],
})
export class SessionScheduleModule {}
