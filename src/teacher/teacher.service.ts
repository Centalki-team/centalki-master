import { Injectable } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { SessionStudentFeedback } from 'src/feedback/entities/session-student-feedback.entity';
import { _APP_FEE_ } from 'src/global/constant';
import { SessionSchedule } from 'src/session-schedule/entities/session-schedule.entity';
import { ESessionScheduleStatus } from 'src/session-schedule/enum/session-schedule-status.enum';
import { GetDashboardDto } from 'src/teacher/dto/get-dashboard';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(SessionSchedule)
    private sessionRepository: BaseFirestoreRepository<SessionSchedule>,
    @InjectRepository(SessionStudentFeedback)
    private sessionStudentFeedbackRepository: BaseFirestoreRepository<SessionStudentFeedback>,
  ) {}

  async countBySessionIds(sessionIds: string[]) {
    if (!sessionIds.length) {
      return { ratingCount: 0, average: 0 };
    }
    const batches = [];

    while (sessionIds.length) {
      // firestore limits batches to 10
      const batch = sessionIds.splice(0, 10);

      // add the batch request to to a queue
      batches.push(
        this.sessionStudentFeedbackRepository
          .whereIn('sessionId', batch)
          .find(),
      );
    }

    const resp = await Promise.all(batches);
    const studentFeedbacks = resp.flat();
    const ratingCount = studentFeedbacks.length;
    const sumOfRating = studentFeedbacks.reduce(
      (acc, cur) => acc + cur.rating,
      0,
    );
    return { ratingCount, average: sumOfRating / ratingCount };
  }

  async getDashboard(user: UserRecord, query: GetDashboardDto) {
    const teacherId = user.uid;
    const taughtSessions = await this.sessionRepository
      .whereEqualTo('teacherId', teacherId)
      .whereEqualTo('status', ESessionScheduleStatus.COMPLETED)
      .find();
    const sessionIds = taughtSessions.map((item) => item.id);
    const totalCompletedSession = taughtSessions.length;
    const currentEarnings = taughtSessions.reduce(
      (earning, session) => earning + (session.cost - _APP_FEE_),
      0,
    );
    const studentIds = [
      ...new Set(...taughtSessions.map((item) => item.studentId)),
    ];
    const numUniqueStudents = studentIds.length;
    const rating = await this.countBySessionIds(sessionIds);
    return {
      totalCompletedSession,
      currentEarnings,
      numUniqueStudents,
      rating,
    };
  }
}
