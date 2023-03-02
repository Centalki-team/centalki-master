import { Body, Controller, Put, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApproveTeacherDto } from 'src/admin/dto/approve-teacher.dto';
import { AdminService } from './admin.service';

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
}
