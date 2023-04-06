import {
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SchedulerRegistry } from '@nestjs/schedule';
import { instanceToPlain } from 'class-transformer';
import { UserRecord } from 'firebase-admin/auth';
import { BaseFirestoreRepository, IQueryBuilder } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { AuthService } from 'src/auth/auth.service';
import { ERole } from 'src/auth/enum/role.enum';
import { CacheManagerService } from 'src/cache-manager/cache-manager.service';
import { CommonService } from 'src/common/common.service';
import { FcmService } from 'src/fcm/fcm.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import {
  NOTIFICATION,
  _30_MINS_MILLISECONDS_,
  _5_MINS_MILLISECONDS_,
  _APP_FEE_,
} from 'src/global/constant';
import { PaginationResult } from 'src/global/types';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { NotificationService } from 'src/notification/notification.service';
import { Topic } from 'src/topic/entities/topic.entity';
import { TopicService } from 'src/topic/topic.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { genId } from 'src/utils/helper';
import { CreateSessionScheduleDto } from './dto/create-session-schedule.dto';
import { EventTrackingDto } from './dto/event-tracking.dto';
import { GetSessionDto, PaginateSessionDto } from './dto/get-session.dto';
import { PickUpDto } from './dto/pick-up.dto';
import {
  EventTracking,
  SessionSchedule,
} from './entities/session-schedule.entity';
import { ESessionScheduleEvent } from './enum/session-schedule-event.enum';
import { ESessionScheduleStatus } from './enum/session-schedule-status.enum';
// import { UpdateSessionScheduleDto } from './dto/update-session-schedule.dto';

@Injectable()
export class SessionScheduleService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly topicService: TopicService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly commonService: CommonService,
    private readonly fcmService: FcmService,
    private readonly notificationService: NotificationService,
    private readonly transactionService: TransactionService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(SessionSchedule)
    private readonly sessionScheduleRepository: BaseFirestoreRepository<SessionSchedule>,
    private schedulerRegistry: SchedulerRegistry,
    private readonly cacheManager: CacheManagerService,
  ) {
    // this.sessionScheduleRepository.find().then((list) => {
    //   for (const item of list) {
    //     this.sessionScheduleRepository
    //       .update({
    //         ...item,
    //         cost: 100_000,
    //       })
    //       .then(() => {
    //         console.log(`Update ${item.id} success`);
    //       });
    //     console.log(item.cost);
    //   }
    // });
  }
  sessionScheduleRef() {
    return this.firebaseService.realTimeDatabase().ref('session-schedule/');
  }
  sessionCacheKey(id: string) {
    return `session-schedule-finding-${id}`;
  }
  async create(createSessionScheduleDto: CreateSessionScheduleDto) {
    return this.sessionScheduleRepository.runTransaction(async () => {
      const studentRunningSession = await this.sessionScheduleRepository
        .whereEqualTo('studentId', createSessionScheduleDto.studentId)
        .whereEqualTo('status', ESessionScheduleStatus.ROUTING)
        .findOne();
      if (studentRunningSession) {
        throw new ConflictException('Student is in session schedule already!');
      }
      const topic = await this.topicService.findOne(
        createSessionScheduleDto.topicId,
      );
      if (!topic) {
        throw new NotFoundException(`TopicID is invalid`);
      }
      const student = await this.firebaseService
        .auth()
        .getUser(createSessionScheduleDto.studentId)
        .catch(() => {
          throw new NotFoundException(`StudentId: is invalid`);
        });

      const canRequestSession = await this.authService.canRequestSession(
        createSessionScheduleDto.studentId,
      );
      if (!canRequestSession) {
        throw new HttpException(
          `Insufficient balance`,
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
      const { costPerSession } = await this.authService.getCostPerSession(
        student.uid,
      );
      const sessionScheduleRef = this.sessionScheduleRef();
      const sessionSchedule = await this.sessionScheduleRepository.create({
        ...createSessionScheduleDto,
        createdAt: new Date().toISOString(),
        startAt: new Date().toISOString(),
        teacherId: null,
        status: ESessionScheduleStatus.ROUTING,
        topic: instanceToPlain(topic.data, {
          exposeUnsetFields: false,
        }) as Topic,
        student: instanceToPlain(student, {
          exposeUnsetFields: false,
        }) as UserRecord,
        cost: costPerSession,
      });
      const cacheKey = this.sessionCacheKey(sessionSchedule.id);
      await this.cacheManager.set(cacheKey, 'true', _5_MINS_MILLISECONDS_); // 5mins

      this.sendNotificationToTeachers(sessionSchedule.id);
      this.schedulerRegistry.addTimeout(
        `${ESessionScheduleStatus.ROUTING}:${cacheKey}`,
        setTimeout(() => {
          this.handleTimeout(sessionSchedule.id);
        }, _5_MINS_MILLISECONDS_),
      );

      this.eventEmitter.emit(ESessionScheduleEvent.CREATED, sessionSchedule.id);
      delete sessionSchedule.eventTrackings;
      sessionScheduleRef.child(sessionSchedule.id).set(sessionSchedule);
      return sessionSchedule;
    });
  }

  async pickUp(sessionId: string, pickUpDto: PickUpDto) {
    return this.sessionScheduleRepository.runTransaction(async () => {
      const isTeacherPickedUp = await this.sessionScheduleRepository
        .whereEqualTo('teacherId', pickUpDto.teacherId)
        .whereEqualTo('status', ESessionScheduleStatus.PICKED_UP)
        .findOne();

      if (isTeacherPickedUp) {
        throw new ConflictException('Teacher is in session!');
      }  

      const sessionSchedule = await this.sessionScheduleRepository.findById(
        sessionId,
      );

      if (!sessionSchedule) {
        throw new NotFoundException();
      }

      if (sessionSchedule.status !== ESessionScheduleStatus.ROUTING) {
        throw new ConflictException('Session is currently not routing!');
      }

      const cacheKey = this.sessionCacheKey(sessionSchedule.id);
      const cacheExist = await this.cacheManager.get(cacheKey);
      if (!cacheExist) {
        throw new ConflictException('Session is timeout!');
      }

      const teacher = await this.firebaseService
        .auth()
        .getUser(pickUpDto.teacherId);
      const newData = await this.sessionScheduleRepository.update({
        ...sessionSchedule,
        status: ESessionScheduleStatus.PICKED_UP,
        teacherId: pickUpDto.teacherId,
        pickedUpAt: new Date().toISOString(),
        teacher: instanceToPlain(teacher, {
          exposeUnsetFields: false,
        }) as UserRecord,
      });

      delete newData.eventTrackings;
      const sessionScheduleRef = this.sessionScheduleRef();
      sessionScheduleRef.child(newData.id).set(newData);
      this.schedulerRegistry.addTimeout(
        `${ESessionScheduleStatus.PICKED_UP}:${cacheKey}`,
        setTimeout(() => {
          this.handleCompleted(sessionSchedule.id);
        }, _30_MINS_MILLISECONDS_),
      );
      return newData;
    });
  }

  async cancel(sessionId: string) {
    return this.sessionScheduleRepository.runTransaction(async () => {
      const sessionSchedule = await this.sessionScheduleRepository.findById(
        sessionId,
      );

      if (!sessionSchedule) {
        throw new NotFoundException();
      }

      // if (sessionSchedule.status !== ESessionScheduleStatus.ROUTING) {
      //   throw new ConflictException('Session is currently not routing!');
      // }
      const newData = await this.sessionScheduleRepository.update({
        ...sessionSchedule,
        status: ESessionScheduleStatus.CANCELLED,
      });

      const sessionScheduleRef = this.sessionScheduleRef();
      delete newData.eventTrackings;
      sessionScheduleRef.child(newData.id).set(newData);
      return newData;
    });
  }

  async handleCompleted(sessionId: string) {
    this.sessionScheduleRepository.runTransaction(async () => {
      const sessionSchedule = await this.sessionScheduleRepository.findById(
        sessionId,
      );
      if (!sessionSchedule) {
        throw new NotFoundException();
      }

      console.log(
        `Session ${sessionId} completed with status ${sessionSchedule.status}!`,
      );

      if (sessionSchedule.status === ESessionScheduleStatus.PICKED_UP) {
        const newData = await this.sessionScheduleRepository.update({
          ...sessionSchedule,
          status: ESessionScheduleStatus.COMPLETED,
        });

        const sessionScheduleRef = this.sessionScheduleRef();
        delete newData.eventTrackings;
        sessionScheduleRef.child(newData.id).set(newData);

        const cost = sessionSchedule.cost || _APP_FEE_;

        // Withdraw student balance
        await this.transactionService.createTransaction(
          sessionSchedule.studentId,
          -cost,
          sessionId,
        );

        // Deposit teacher
        await this.transactionService.createTransaction(
          sessionSchedule.teacherId,
          +cost - _APP_FEE_,
          sessionId,
        );

        const deviceTokens = await this.authService.getDeviceTokens([
          sessionSchedule.teacherId,
          sessionSchedule.studentId,
        ]);
        if (deviceTokens.length) {
          this.fcmService.sendMulticast({
            tokens: deviceTokens,
            notification: {
              title: NOTIFICATION.COMPLETED_SESSION.TITLE(),
              body: NOTIFICATION.COMPLETED_SESSION.BODY(),
            },
            data: NOTIFICATION.COMPLETED_SESSION.PAYLOAD(sessionId),
          });
        }
        this.notificationService.create({
          uid: sessionSchedule.studentId,
          title: {
            en: NOTIFICATION.COMPLETED_SESSION.TITLE(),
          },
          body: {
            en: NOTIFICATION.COMPLETED_SESSION.BODY(),
          },
          data: NOTIFICATION.COMPLETED_SESSION.PAYLOAD(sessionId),
        });
        this.notificationService.create({
          uid: sessionSchedule.teacherId,
          title: {
            en: NOTIFICATION.COMPLETED_SESSION.TITLE(),
          },
          body: {
            en: NOTIFICATION.COMPLETED_SESSION.BODY(),
          },
          data: NOTIFICATION.COMPLETED_SESSION.PAYLOAD(sessionId),
        });
      }
    });
  }

  async handleTimeout(sessionId: string) {
    this.sessionScheduleRepository.runTransaction(async () => {
      const sessionSchedule = await this.sessionScheduleRepository.findById(
        sessionId,
      );
      if (!sessionSchedule) {
        throw new NotFoundException();
      }

      console.log(
        `Session ${sessionId} timed out with status ${sessionSchedule.status}!`,
      );

      if (sessionSchedule.status === ESessionScheduleStatus.ROUTING) {
        const newData = await this.sessionScheduleRepository.update({
          ...sessionSchedule,
          status: ESessionScheduleStatus.TIME_OUT,
        });

        const sessionScheduleRef = this.sessionScheduleRef();
        delete newData.eventTrackings;
        sessionScheduleRef.child(newData.id).set(newData);
        const deviceTokens = await this.authService.getDeviceTokens([
          sessionSchedule.studentId,
        ]);
        if (deviceTokens.length) {
          this.fcmService.sendMulticast({
            tokens: deviceTokens,
            notification: {
              title: NOTIFICATION.ROUTING_TIME_OUT.TITLE(),
              body: NOTIFICATION.ROUTING_TIME_OUT.BODY(),
            },
            data: NOTIFICATION.ROUTING_TIME_OUT.PAYLOAD(sessionId),
          });
        }
        this.notificationService.create({
          uid: sessionSchedule.studentId,
          title: {
            en: NOTIFICATION.ROUTING_TIME_OUT.TITLE(),
          },
          body: {
            en: NOTIFICATION.ROUTING_TIME_OUT.BODY(),
          },
          data: NOTIFICATION.ROUTING_TIME_OUT.PAYLOAD(sessionId),
        });
      }
    });
  }

  async getByUser(query: GetSessionDto) {
    let qb: IQueryBuilder<SessionSchedule> = this.sessionScheduleRepository;

    if (query.studentId) {
      qb = qb.whereEqualTo('studentId', query.studentId);
    }

    if (query.teacherId) {
      qb = qb.whereEqualTo('teacherId', query.teacherId);
    }

    if (query.status) {
      qb = qb.whereEqualTo('status', query.status);
    }

    return qb
      .limit(5)
      .find()
      .then((sessions) => {
        for (const session of sessions) {
          delete session.eventTrackings;
        }
        return sessions;
      });
  }

  async paginate(
    query: PaginateSessionDto,
    user: UserRecord,
  ): Promise<PaginationResult<SessionSchedule>> {
    const { page, size, status } = query;

    const data = await this.sessionScheduleRepository
      .whereEqualTo('status', status)
      .whereEqualTo('studentId', user.uid)
      .orderByDescending('createdAt')
      .find();
    const completedSession = await this.countSession(
      user.uid,
      ESessionScheduleStatus.COMPLETED,
    );

    return {
      meta: {
        hasNextPage: false,
        hasPrevPage: false,
        page,
        size,
        completedSession,
      },
      data,
    };
  }

  async paginateTaught(
    query: PaginateSessionDto,
    user: UserRecord,
  ): Promise<PaginationResult<SessionSchedule>> {
    const { page, size, status } = query;

    const data = await this.sessionScheduleRepository
      .whereEqualTo('status', status)
      .whereEqualTo('teacherId', user.uid)
      .orderByDescending('createdAt')
      .find();
    const completedSession = await this.countSession(
      user.uid,
      ESessionScheduleStatus.COMPLETED,
    );

    return {
      meta: {
        hasNextPage: false,
        hasPrevPage: false,
        page,
        size,
        completedSession,
      },
      data,
    };
  }

  async eventTracking(sessionId: string, eventTrackingDto: EventTrackingDto) {
    const sessionSchedule = await this.sessionScheduleRepository.findById(
      sessionId,
    );

    if (!sessionSchedule) {
      throw new NotFoundException('SessionId is invalid!');
    }

    // Create a batch for the subcollection
    const eventTrackingsBatch = sessionSchedule.eventTrackings.createBatch();
    const eventTracking = new EventTracking();
    eventTracking.id = genId();
    eventTracking.sessionId = sessionId;
    eventTracking.name = eventTrackingDto.name;
    eventTracking.timestamp = new Date().toISOString();
    eventTrackingsBatch.create(eventTracking);
    await eventTrackingsBatch.commit();
    return await sessionSchedule.eventTrackings.find();
  }

  async getEventTrackings(sessionId: string) {
    const sessionSchedule = await this.sessionScheduleRepository.findById(
      sessionId,
    );

    if (!sessionSchedule) {
      throw new NotFoundException('SessionId is invalid!');
    }

    return await sessionSchedule.eventTrackings.find();
  }

  // async completeLesson(userId: number, isTeacher: boolean) {
  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new NotFoundException(`User with ID "${userId}" not found`);
  //   }

  //   const amount = user.lessonRate;
  //   if (isTeacher) {
  //     user.balance += amount;
  //   } else {
  //     user.balance -= amount;
  //   }

  //   await this.userRepository.save(user);
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} sessionSchedule`;
  // }

  async countSession(studentId: string, status: ESessionScheduleStatus) {
    const studentRunningSession = await this.sessionScheduleRepository
      .whereEqualTo('studentId', studentId)
      .whereEqualTo('status', status)
      .find();
    return studentRunningSession.length;
  }

  async getRunningSessions() {
    const sessions = await this.sessionScheduleRepository
      .whereEqualTo('status', ESessionScheduleStatus.PICKED_UP)
      .find();
    return sessions;
  }

  async sendNotificationToTeachers(sessionId: string) {
    const teacherIds = await this.authService.getUserIdsByRole(ERole.TEACHER);

    const unavailableTeachers = await this.getRunningSessions();
    const unavailableIds = unavailableTeachers.map((item) => item.teacherId);
    console.log(
      `Session #${sessionId}, unavailableIds = ${unavailableIds.join(
        ' + ',
      )} created`,
    );
    const availableIds = teacherIds.filter(
      (id) => !unavailableIds.includes(id),
    );
    console.log(`Start push notification to ${availableIds.join(' + ')}`);

    const deviceTokens = await this.authService.getDeviceTokens(availableIds);
    if (deviceTokens.length) {
      const message = {
        notification: {
          title: NOTIFICATION.NEW_SESSION.TITLE(),
          body: NOTIFICATION.NEW_SESSION.BODY(),
        },
        data: NOTIFICATION.NEW_SESSION.PAYLOAD(sessionId),
        tokens: deviceTokens,
      };

      await this.fcmService.sendMulticast(message);
      console.log(`Push notification to ${availableIds.join(' + ')} success`);

      const createNotificationDtos: CreateNotificationDto[] = availableIds.map(
        (uid) => ({
          uid,
          title: {
            en: NOTIFICATION.NEW_SESSION.TITLE(),
          },
          body: {
            en: NOTIFICATION.NEW_SESSION.BODY(),
          },
          data: NOTIFICATION.NEW_SESSION.PAYLOAD(sessionId),
        }),
      );
      await Promise.all(
        createNotificationDtos.map((item) =>
          this.notificationService.create(item),
        ),
      );
    }
  }
}
