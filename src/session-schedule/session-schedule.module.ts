import { forwardRef, Module } from '@nestjs/common';
import { SessionScheduleService } from './session-schedule.service';
import { SessionScheduleController } from './session-schedule.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FireormModule } from 'nestjs-fireorm';
import { SessionSchedule } from './entities/session-schedule.entity';
import { TopicModule } from 'src/topic/topic.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    FireormModule.forFeature([SessionSchedule]),
    FirebaseModule,
    TopicModule,
    forwardRef(() => AuthModule),
    CommonModule,
  ],
  controllers: [SessionScheduleController],
  providers: [SessionScheduleService],
  exports: [SessionScheduleService],
})
export class SessionScheduleModule {}
