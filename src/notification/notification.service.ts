import { Injectable } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { BaseFirestoreRepository } from 'fireorm';
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

    let qb = this.notificationRepository.whereEqualTo('uid', user.uid);
    if (sort) {
      const [fieldPath, directionStr] = query.sort.split(':');
      if (fieldPath === 'pickedUpAt') {
        if (directionStr == 'asc') {
          qb = qb.orderByAscending('createdAt');
        } else {
          qb = qb.orderByDescending('createdAt');
        }
      }
    }
    const data = await qb.find();

    return {
      meta: {
        hasNextPage: false,
        hasPrevPage: false,
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
  async markAllUnseen(user: UserRecord) {
    const listNotification = await this.notificationRepository
      .whereEqualTo('uid', user.uid)
      .find();
    const seenNotifications = listNotification.map((item) => ({
      ...item,
      seenAt: null,
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
