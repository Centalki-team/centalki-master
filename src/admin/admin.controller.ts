import {
  Body,
  Controller,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApproveTeacherDto } from 'src/admin/dto/approve-teacher.dto';
import { AdminService } from './admin.service';
import { ForceEndDto } from 'src/admin/dto/force-end-session';
import { Auth } from 'src/global/decorator';
import { ERole } from 'src/auth/enum/role.enum';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Auth(ERole.ADMIN)
  @Put('approve-teacher')
  approveTeacher(@Body() dto: ApproveTeacherDto) {
    return this.adminService.approveTeacher(dto);
  }

  @Post('force-end-session')
  forceEndSession(@Body() dto: ForceEndDto) {
    return this.adminService.handleEndSession(dto);
  }
}
