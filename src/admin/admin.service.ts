import { Injectable } from '@nestjs/common';
import { ApproveTeacherDto } from 'src/admin/dto/approve-teacher.dto';
import { ForceEndDto } from 'src/admin/dto/force-end-session';
import { AuthService } from 'src/auth/auth.service';
import { SessionScheduleService } from 'src/session-schedule/session-schedule.service';

@Injectable()
export class AdminService {
  constructor(
    private authService: AuthService,
    private sessionService: SessionScheduleService,
  ) {}
  approveTeacher(dto: ApproveTeacherDto) {
    return this.authService.approveTeacher(dto.email);
  }

  handleEndSession(dto: ForceEndDto) {
    return this.sessionService.handleCompleted(dto.sessionId);
  }
}
