import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/global/guard';
import { User } from 'src/global/decorator';
import { UserRecord } from 'firebase-admin/auth';
import { GetDashboardDto } from 'src/teacher/dto/get-dashboard';

@Controller('teacher')
@ApiTags('Teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Lấy thông tin tổng quan của giáo viên',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  getDashboard(@User() user: UserRecord, @Query() query: GetDashboardDto) {
    return this.teacherService.getDashboard(user, query);
  }
}
