import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/global/guard';
import { User } from 'src/global/decorator';
import { UserRecord } from 'firebase-admin/auth';
import { GetHistoryDto } from 'src/teacher/dto/get-history';

@Controller('teacher')
@ApiTags('Teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('history')
  @ApiOperation({
    summary: 'Lấy thông tin tổng quan của giáo viên',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  getHistory(@User() user: UserRecord, @Query() query: GetHistoryDto) {
    return this.teacherService.getHistory(user, query);
  }
}
