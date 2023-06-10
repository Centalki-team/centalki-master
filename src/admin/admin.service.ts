import { Injectable } from '@nestjs/common';
// import { UidIdentifier } from 'firebase-admin/auth';
import { ApproveTeacherDto } from 'src/admin/dto/approve-teacher.dto';
import { ForceEndDto } from 'src/admin/dto/force-end-session';
import { GetTeacherDto } from 'src/admin/dto/get-users.dto';
import { AuthService } from 'src/auth/auth.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SessionScheduleService } from 'src/session-schedule/session-schedule.service';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class AdminService {
  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private sessionService: SessionScheduleService,
    private teacherService: TeacherService,
  ) {}
  approveTeacher(dto: ApproveTeacherDto) {
    return this.authService.approveTeacher(dto.email);
  }

  handleEndSession(dto: ForceEndDto) {
    return this.sessionService.handleCompleted(dto.sessionId);
  }

  async getUsersByRole(dto: GetTeacherDto) {
    const teacherIds = await this.authService.getUserIdsByRole(dto.role);
    const uidIdentifiers = teacherIds.map((uid) => ({
      uid,
    }));
    const users = await this.firebaseService.auth().getUsers(uidIdentifiers);
    const teachers = users.users || [];
    // const promises = teachers.map(async (item) => {
    //   const detail = await this.teacherService.getTeacherDetail(item.uid);
    //   return {
    //     ...item,
    //     detail,
    //   };
    // });
    return {
      data: teachers,
    };
  }
}
