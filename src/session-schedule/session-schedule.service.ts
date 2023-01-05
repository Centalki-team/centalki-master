import { ConflictException, Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateSessionScheduleDto } from './dto/create-session-schedule.dto';
import { PickUpDto } from './dto/pick-up.dto';
import { SessionSchedule } from './entities/session-schedule.entity';
import { ESessionScheduleStatus } from './enum/session-schedule-status.enum';
// import { UpdateSessionScheduleDto } from './dto/update-session-schedule.dto';

@Injectable()
export class SessionScheduleService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(SessionSchedule)
    private sessionScheduleRepository: BaseFirestoreRepository<SessionSchedule>,
  ) {}
  sessionScheduleRef() {
    return this.firebaseService.realTimeDatabase().ref('session-schedule/');
  }
  async create(createSessionScheduleDto: CreateSessionScheduleDto) {
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
    });
    sessionScheduleRef
      .child(createSessionScheduleDto.studentId)
      .set(sessionSchedule);
    return sessionSchedule;
  }

  async pickUp(sessionId: string, pickUpDto: PickUpDto) {
    return this.sessionScheduleRepository.runTransaction(async () => {
      const sessionSchedule = await this.sessionScheduleRepository.findById(
        sessionId,
      );

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
      sessionScheduleRef.child(sessionSchedule.studentId).set(newData);
      return newData;
    });
  }

  async cancel(sessionId: string) {
    return this.sessionScheduleRepository.runTransaction(async () => {
      const sessionSchedule = await this.sessionScheduleRepository.findById(
        sessionId,
      );

      if (sessionSchedule.status !== ESessionScheduleStatus.ROUTING) {
        throw new ConflictException('Session is currently not routing!');
      }
      const newData = await this.sessionScheduleRepository.update({
        ...sessionSchedule,
        status: ESessionScheduleStatus.CANCELLED,
      });

      const sessionScheduleRef = this.sessionScheduleRef();
      sessionScheduleRef.child(sessionSchedule.studentId).set(newData);
      return newData;
    });
  }

  // findAll() {
  //   return `This action returns all sessionSchedule`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} sessionSchedule`;
  // }
}
