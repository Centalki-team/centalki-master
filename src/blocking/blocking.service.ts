import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlockingDto } from './dto/create-blocking.dto';
import { InjectRepository } from 'nestjs-fireorm';
import { Blocking } from 'src/blocking/entities/blocking.entity';
import { BaseFirestoreRepository } from 'fireorm';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserRecord } from 'firebase-admin/auth';
// import { UpdateBlockingDto } from './dto/update-blocking.dto';

@Injectable()
export class BlockingService {
  constructor(
    @InjectRepository(Blocking)
    private blockingRepository: BaseFirestoreRepository<Blocking>,
    private firebaseService: FirebaseService,
  ) {}
  async create(dto: CreateBlockingDto, user: UserRecord) {
    const { blockedId } = dto;
    const blocked = await this.firebaseService.auth().getUser(blockedId);
    if (!blocked) {
      throw new NotFoundException('Blocked user not found!');
    }
    return await this.blockingRepository.create({
      userId: user.uid,
      blockedId,
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
