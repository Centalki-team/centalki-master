import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/global/guard';
import { User } from 'src/global/decorator';
import { UserRecord } from 'firebase-admin/auth';
import { PaginateNotificationsDto } from 'src/notification/dto/get-notifications.dto';

@Controller('notification')
@ApiTags('Thông báo')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Put(':id/seen')
  @ApiOperation({
    summary: 'Đánh dấu tin nhắn đã đọc',
    description: 'Đánh dấu tin nhắn đã đọc dựa vào id',
  })
  seen(@Param('id') id: string) {
    return this.notificationService.seen(id);
  }

  @Put('mark-all-seen')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({
    summary: 'Đánh dấu tất cả tin nhắn đã đọc',
    description: 'Đánh dấu tất cả tin nhắn đã đọc dựa vào Bearer Token',
  })
  @ApiBearerAuth()
  markAllSeen(@User() user: UserRecord) {
    return this.notificationService.markAllSeen(user);
  }

  @Put('mark-all-unseen')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({
    summary: 'Đánh dấu tất cả tin nhắn chưa đọc',
    description: 'Đánh dấu tất cả tin nhắn chưa đọc dựa vào Bearer Token',
  })
  @ApiBearerAuth()
  markAllUnseen(@User() user: UserRecord) {
    return this.notificationService.markAllUnseen(user);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách thông báo',
    description: 'Lấy danh sách thông báo của người dùng có phân trang',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  findAll(@Query() query: PaginateNotificationsDto, @User() user: UserRecord) {
    return this.notificationService.paginate(query, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết thông báo',
    description: 'Lấy chi tiết thông báo dựa vào id',
  })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateNotificationDto: UpdateNotificationDto,
  // ) {
  //   return this.notificationService.update(+id, updateNotificationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationService.remove(+id);
  // }
}
