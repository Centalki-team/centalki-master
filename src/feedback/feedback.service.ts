import { Injectable } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { CommonService } from 'src/common/common.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PaginationResult } from 'src/global/types';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { GetFeedbacksDto } from './dto/get-feedbacks.dto';
// import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { CreateStudentSessionFeedbackDto } from 'src/feedback/dto/create-student-session-feedback.dto';
import { SessionStudentFeedback } from 'src/feedback/entities/session-student-feedback.entity';
import { SessionTeacherFeedback } from 'src/feedback/entities/session-teacher-feedback.entity';
import { CreateTeacherSessionFeedbackDto } from 'src/feedback/dto/create-teacher-session-feedback.dto';
import { TopicFeedback } from 'src/feedback/entities/topic-feedback.entity';
import { CreateTopicFeedbackDto } from 'src/feedback/dto/create-topic-feedback.dto';
import { negative, positive } from 'src/feedback/constant';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: BaseFirestoreRepository<Feedback>,
    @InjectRepository(SessionStudentFeedback)
    private sessionStudentFeedbackRepository: BaseFirestoreRepository<SessionStudentFeedback>,
    @InjectRepository(SessionTeacherFeedback)
    private sessionTeacherFeedbackRepository: BaseFirestoreRepository<SessionTeacherFeedback>,
    @InjectRepository(TopicFeedback)
    private topicFeedbackRepository: BaseFirestoreRepository<TopicFeedback>,
    private commonService: CommonService,
    private firebaseService: FirebaseService,
  ) {}
  create(user: DecodedIdToken, createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackRepository.create({
      userId: user.uid,
      ...createFeedbackDto,
    });
  }

  async findAll(query: GetFeedbacksDto): Promise<PaginationResult<Feedback>> {
    const { page, size } = query;

    const { data, hasNextPage, hasPrevPage } = await this.commonService.find(
      this.feedbackRepository,
      [],
      page,
      size,
    );

    const getUserInfoPromises = data.map(async (record) => {
      const user = await this.firebaseService.auth().getUser(record.userId);
      return {
        ...record,
        user,
      };
    });
    const dataWithUserInfo = await Promise.all(getUserInfoPromises);

    return {
      meta: {
        hasNextPage,
        hasPrevPage,
        page,
        size,
      },
      data: dataWithUserInfo,
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} feedback`;
  // }

  // update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
  //   return `This action updates a #${id} feedback`;
  // }

  async remove(id: string) {
    try {
      this.feedbackRepository.delete(id);
    } catch {}
    return 1;
  }

  createStudentSessionFeedback(
    user: DecodedIdToken,
    dto: CreateStudentSessionFeedbackDto,
  ) {
    return this.sessionStudentFeedbackRepository.create({
      ...dto,
    });
  }
  createTeacherSessionFeedback(
    user: DecodedIdToken,
    dto: CreateTeacherSessionFeedbackDto,
  ) {
    return this.sessionTeacherFeedbackRepository.create({
      ...dto,
    });
  }

  async getFeedbackBySessionId(sessionId: string) {
    const teacher = await this.sessionStudentFeedbackRepository
      .whereEqualTo('sessionId', sessionId)
      .findOne();
    const notSatisfiedKeys = teacher?.notSatisfiedWith || [];
    const studentNotSatisfiedWith = negative.filter((item) =>
      notSatisfiedKeys.includes(item.key),
    );
    const satisfiedKeys = teacher?.notSatisfiedWith || [];

    const studentSatisfiedWith = positive.filter((item) =>
      satisfiedKeys.includes(item.key),
    );
    const student = await this.sessionTeacherFeedbackRepository
      .whereEqualTo('sessionId', sessionId)
      .findOne();
    return { teacher, studentNotSatisfiedWith, studentSatisfiedWith, student };
  }

  createTopicFeedback(user: DecodedIdToken, dto: CreateTopicFeedbackDto) {
    return this.topicFeedbackRepository.create({
      userId: user.uid,
      ...dto,
    });
  }
}
