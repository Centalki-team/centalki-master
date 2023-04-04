import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportingDto } from './dto/create-reporting.dto';
import { InjectRepository } from 'nestjs-fireorm';
import { BaseFirestoreRepository } from 'fireorm';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserRecord } from 'firebase-admin/auth';
import { Reporting } from 'src/reporting/entities/reporting.entity';
// import { UpdateBlockingDto } from './dto/update-blocking.dto';

@Injectable()
export class ReportingService {
  constructor(
    @InjectRepository(Reporting)
    private reportingRepository: BaseFirestoreRepository<Reporting>,
    private firebaseService: FirebaseService,
  ) {}
  async create(dto: CreateReportingDto, user: UserRecord) {
    const { reportedId, summary, detail } = dto;
    const reported = await this.firebaseService.auth().getUser(reportedId);
    if (!reported) {
      throw new NotFoundException('Reported user not found!');
    }
    return await this.reportingRepository.create({
      userId: user.uid,
      user,
      reportedId,
      reported,
      summary,
      detail,
      createdAt: new Date().toISOString(),
    });
  }

  // findAll() {
  //   return `This action returns all blocking`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} blocking`;
  // }

  // update(id: number, updateBlockingDto: UpdateBlockingDto) {
  //   return `This action updates a #${id} blocking`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} blocking`;
  // }
}
