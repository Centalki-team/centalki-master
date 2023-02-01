import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateSessionScheduleDto } from './dto/create-session-schedule.dto';
import { PickUpDto } from './dto/pick-up.dto';
import { SessionSchedule } from './entities/session-schedule.entity';
import { ESessionScheduleEvent } from './enum/session-schedule-event.enum';
import { ESessionScheduleStatus } from './enum/session-schedule-status.enum';
// import { UpdateSessionScheduleDto } from './dto/update-session-schedule.dto';

@Injectable()
export class SessionScheduleService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(SessionSchedule)
    private readonly sessionScheduleRepository: BaseFirestoreRepository<SessionSchedule>,
  ) {}
  sessionScheduleRef() {
    return this.firebaseService.realTimeDatabase().ref('session-schedule/');
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
      const sessionScheduleRef = this.sessionScheduleRef();
      const sessionSchedule = await this.sessionScheduleRepository.create({
        ...createSessionScheduleDto,
        createdAt: new Date().toISOString(),
        startAt: new Date().toISOString(),
        teacherId: null,
        status: ESessionScheduleStatus.ROUTING,
        // topic:
      });
      this.eventEmitter.emit(ESessionScheduleEvent.CREATED, sessionSchedule.id);
      sessionScheduleRef.child(sessionSchedule.id).set(sessionSchedule);
      return sessionSchedule;
    });
  }

  async pickUp(sessionId: string, pickUpDto: PickUpDto) {
    return this.sessionScheduleRepository.runTransaction(async () => {
      const sessionSchedule = await this.sessionScheduleRepository.findById(
        sessionId,
      );
      if (!sessionSchedule) {
        throw new NotFoundException();
      }

      if (sessionSchedule.status !== ESessionScheduleStatus.ROUTING) {
        throw new ConflictException('Session is currently not routing!');
      }
      const newData = await this.sessionScheduleRepository.update({
        ...sessionSchedule,
        status: ESessionScheduleStatus.PICKED_UP,
        teacherId: pickUpDto.teacherId,
        pickedUpAt: new Date().toISOString(),
      });

      const sessionScheduleRef = this.sessionScheduleRef();
      sessionScheduleRef.child(newData.id).set(newData);
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

      if (sessionSchedule.status !== ESessionScheduleStatus.ROUTING) {
        throw new ConflictException('Session is currently not routing!');
      }
      const newData = await this.sessionScheduleRepository.update({
        ...sessionSchedule,
        status: ESessionScheduleStatus.CANCELLED,
      });

      const sessionScheduleRef = this.sessionScheduleRef();
      sessionScheduleRef.child(newData.id).set(newData);
      return newData;
    });
  }

  async timeout(sessionId: string) {
    setTimeout(async () => {
      this.sessionScheduleRepository.runTransaction(async () => {
        const sessionSchedule = await this.sessionScheduleRepository.findById(
          sessionId,
        );
        if (!sessionSchedule) {
          throw new NotFoundException();
        }
        if (sessionSchedule.status === ESessionScheduleStatus.ROUTING) {
          const newData = await this.sessionScheduleRepository.update({
            ...sessionSchedule,
            status: ESessionScheduleStatus.TIME_OUT,
          });

          const sessionScheduleRef = this.sessionScheduleRef();
          sessionScheduleRef.child(newData.id).set(newData);
        }
      });
    }, 5 * 60 * 1000);
  }

  // findAll() {
  //   return `This action returns all sessionSchedule`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} sessionSchedule`;
  // }
}
