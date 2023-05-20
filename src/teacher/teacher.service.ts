import { Injectable } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { SessionStudentFeedback } from 'src/feedback/entities/session-student-feedback.entity';
import { FeedbackService } from 'src/feedback/feedback.service';
import { _APP_FEE_ } from 'src/global/constant';
import { SessionSchedule } from 'src/session-schedule/entities/session-schedule.entity';
import { ESessionScheduleStatus } from 'src/session-schedule/enum/session-schedule-status.enum';
import { GetHistoryDto } from 'src/teacher/dto/get-history';
import { compare, countUnique } from 'src/utils/helper';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(SessionSchedule)
    private sessionRepository: BaseFirestoreRepository<SessionSchedule>,
    @InjectRepository(SessionStudentFeedback)
    private sessionStudentFeedbackRepository: BaseFirestoreRepository<SessionStudentFeedback>,
    private readonly feedbackService: FeedbackService,
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

  async getHistory(user: UserRecord, query: GetHistoryDto) {
    const teacherId = user.uid;
    let qb = this.sessionRepository
      .whereEqualTo('teacherId', teacherId)
      .whereEqualTo('status', ESessionScheduleStatus.COMPLETED);
    if (query.from) {
      qb = qb.whereGreaterOrEqualThan('pickedUpAt', query.from);
    }
    if (query.to) {
      qb = qb.whereLessOrEqualThan('pickedUpAt', query.to);
    }

    if (query.sort) {
      const [fieldPath, directionStr] = query.sort.split(':');
      if (fieldPath === 'pickedUpAt') {
        if (directionStr == 'asc') {
          qb = qb.orderByAscending('pickedUpAt');
        } else {
          qb = qb.orderByDescending('pickedUpAt');
        }
      }
    }

    const taughtSessions = await qb.find();
    const sessionIds = taughtSessions.map((item) => item.id);
    const totalCompletedSession = taughtSessions.length;
    const currentEarnings = taughtSessions.reduce(
      (earning, session) => earning + (session.cost - _APP_FEE_),
      0,
    );
    const studentIds = taughtSessions.map((item) => item.studentId);
    const numUniqueStudents = countUnique(studentIds);
    const rating = await this.countBySessionIds(sessionIds);

    const promises = taughtSessions.map(async (session) => {
      const feedback = await this.feedbackService.getFeedbackBySessionId(
        session.id,
      );
      return {
        ...session,
        feedback,
      };
    });
    const data = await Promise.all(promises);
    if (query.sort) {
      const [fieldPath, directionStr] = query.sort.split(':');
      if (fieldPath === 'rating') {
        if (directionStr === 'asc') {
          data.sort((a, b) =>
            compare(a.feedback.teacher?.rating, b.feedback.teacher?.rating),
          );
        } else {
          data.sort((a, b) =>
            compare(b.feedback.teacher?.rating, a.feedback.teacher?.rating),
          );
        }
      }
    }

    return {
      totalCompletedSession,
      currentEarnings,
      numUniqueStudents,
      rating,
      data,
    };
  }
}
