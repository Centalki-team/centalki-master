import { Injectable } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import {
  BaseFirestoreRepository,
  FirestoreOperators,
  IFireOrmQueryLine,
} from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { CommonService } from 'src/common/common.service';
import { PaginationResult } from 'src/global/types';
import { PaginateNotificationsDto } from 'src/notification/dto/get-notifications.dto';
import { Notification } from 'src/notification/entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: BaseFirestoreRepository<Notification>,
    private commonService: CommonService,
  ) {}
  create(dto: CreateNotificationDto) {
    return this.notificationRepository.create({
      ...dto,
      createdAt: new Date().toISOString(),
      seenAt: null,
    });
  }

  async paginate(
    query: PaginateNotificationsDto,
    user: UserRecord,
  ): Promise<PaginationResult<Notification>> {
    const { page, size, sort } = query;

    const queries: IFireOrmQueryLine[] = [
      {
        prop: 'uid',
        val: user.uid,
        operator: FirestoreOperators.equal,
      },
    ];

    const { data, hasNextPage, hasPrevPage } = await this.commonService.find(
      this.notificationRepository,
      queries,
      page,
      size,
      sort,
    );

    return {
      meta: {
        hasNextPage,
        hasPrevPage,
        page,
        size,
      },
      data,
    };
  }

  findOne(id: string) {
    return this.notificationRepository.findById(id);
  }

  async seen(id: string) {
    const notification = await this.notificationRepository.findById(id);
    if (notification) {
      notification.seenAt = new Date().toISOString();
      return await this.notificationRepository.update(notification);
    }
    return null;
  }

  async markAllSeen(user: UserRecord) {
    const listNotification = await this.notificationRepository
      .whereEqualTo('uid', user.uid)
      .find();
    const seenNotifications = listNotification.map((item) => ({
      ...item,
      seenAt: new Date().toISOString(),
    }));
    return await Promise.all(
      seenNotifications.map((item) => this.notificationRepository.update(item)),
    );
  }

  // update(id: number, updateNotificationDto: UpdateNotificationDto) {
  //   return `This action updates a #${id} notification`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }
}
