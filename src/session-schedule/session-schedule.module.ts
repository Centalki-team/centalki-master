import { Module } from '@nestjs/common';
import { SessionScheduleService } from './session-schedule.service';
import { SessionScheduleController } from './session-schedule.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { FireormModule } from 'nestjs-fireorm';
import { SessionSchedule } from './entities/session-schedule.entity';

@Module({
  imports: [FireormModule.forFeature([SessionSchedule]), FirebaseModule],
  controllers: [SessionScheduleController],
  providers: [SessionScheduleService],
})
export class SessionScheduleModule {}