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

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: BaseFirestoreRepository<Feedback>,
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
}
