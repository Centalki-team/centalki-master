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

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Put('approve-teacher')
  approveTeacher(@Body() dto: ApproveTeacherDto) {
    if (process.env.API_KEY !== dto.apiKey) {
      throw new UnauthorizedException();
    }
    return this.adminService.approveTeacher(dto);
  }

  @Post('force-end-session')
  forceEndSession(@Body() dto: ForceEndDto) {
    if (process.env.API_KEY !== dto.apiKey) {
      throw new UnauthorizedException();
    }
    return this.adminService.handleEndSession(dto);
  }
}
