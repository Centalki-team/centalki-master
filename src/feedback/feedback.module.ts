import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Feedback } from './entities/feedback.entity';
import { CommonModule } from 'src/common/common.module';
import { SessionStudentFeedback } from 'src/feedback/entities/session-student-feedback.entity';
import { SessionTeacherFeedback } from 'src/feedback/entities/session-teacher-feedback.entity';

@Module({
  imports: [
    FireormModule.forFeature([
      Feedback,
      SessionStudentFeedback,
      SessionTeacherFeedback,
    ]),
    CommonModule,
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
