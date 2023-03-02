import { Injectable } from '@nestjs/common';
import { ApproveTeacherDto } from 'src/admin/dto/approve-teacher.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminService {
  constructor(private authService: AuthService) {}
  approveTeacher(dto: ApproveTeacherDto) {
    return this.authService.approveTeacher(dto.email);
  }
}
