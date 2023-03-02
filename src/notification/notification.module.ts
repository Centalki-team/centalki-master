import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Notification } from 'src/notification/entities/notification.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [FireormModule.forFeature([Notification]), CommonModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
