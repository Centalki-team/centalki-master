import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { FireormModule } from 'nestjs-fireorm';
import { SessionSchedule } from 'src/session-schedule/entities/session-schedule.entity';
import { SessionStudentFeedback } from 'src/feedback/entities/session-student-feedback.entity';

@Module({
  imports: [
    FireormModule.forFeature([SessionSchedule, SessionStudentFeedback]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
