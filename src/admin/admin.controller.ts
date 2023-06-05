import {
  Body,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApproveTeacherDto } from 'src/admin/dto/approve-teacher.dto';
import { AdminService } from './admin.service';
import { ForceEndDto } from 'src/admin/dto/force-end-session';
import { Auth } from 'src/global/decorator';
import { ERole } from 'src/auth/enum/role.enum';
import { GetTeacherDto } from 'src/admin/dto/get-users.dto';
import { _30_MINS_MILLISECONDS_ } from 'src/global/constant';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Auth(ERole.ADMIN)
  @Put('approve-teacher')
  approveTeacher(@Body() dto: ApproveTeacherDto) {
    return this.adminService.approveTeacher(dto);
  }

  @Get('users')
  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(_30_MINS_MILLISECONDS_)
  @Auth(ERole.ADMIN)
  getUsersByRole(@Query() query: GetTeacherDto) {
    return this.adminService.getUsersByRole(query);
  }

  @Post('force-end-session')
  forceEndSession(@Body() dto: ForceEndDto) {
    return this.adminService.handleEndSession(dto);
  }
}
