import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SessionScheduleModule } from 'src/session-schedule/session-schedule.module';

@Module({
  imports: [AuthModule, SessionScheduleModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
