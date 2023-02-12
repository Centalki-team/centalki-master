import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Feedback } from './entities/feedback.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [FireormModule.forFeature([Feedback]), CommonModule, FireormModule],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
