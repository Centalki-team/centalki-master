import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Query,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRecord } from 'firebase-admin/auth';
import { User } from 'src/global/decorator';
import { FirebaseAuthGuard } from 'src/global/guard';
import { PaginateSessionDto } from 'src/session-schedule/dto/get-session.dto';
import { SessionScheduleService } from 'src/session-schedule/session-schedule.service';
import { AuthService } from './auth.service';
import { SetRoleDto } from './dto/set-role.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Lấy thông tin cá nhân',
    description:
      'Lấy thông tin cá nhân của người dùng dựa vào Authentication HTTP Header',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  getUserProfile(@User() user: UserRecord) {
    return this.authService.getUserProfile(user);
  }

  @Get('balance')
  @ApiOperation({
    summary: 'Lấy số dư tài khoản',
    description:
      'Lấy số dư tài khoản của người dùng dựa vào Authentication HTTP Header',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  getBalance(@User() user: UserRecord) {
    return this.authService.getBalance(user);
  }

  @Get('sessions')
  @ApiOperation({
    summary: 'Lấy danh sách buổi học',
    description:
      'Lấy danh sách buổi học của người dùng dựa vào Authentication HTTP Header',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  getSessions(@Query() query: PaginateSessionDto) {
    return this.authService.paginateSessions(query);
  }

  @Patch('profile')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật thông tin cá nhân',
    description: 'Cập nhật thông tin cá nhân của người dùng',
  })
  updateUserProfile(@User() user: UserRecord, @Body() dto: UpdateProfileDto) {
    return this.authService.updateUserProfile(user, dto);
  }

  @Post('assign-role')
  @ApiOperation({
    summary: 'Phân role người dùng',
    description: 'Phân role người dùng',
  })
  @ApiBearerAuth()
  assignRole(@Body() dto: SetRoleDto) {
    return this.authService.assignRole(dto);
  }

  @Post('validate-role')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xác minh role',
    description: 'Xác minh role người dùng trên hệ thống',
  })
  validateRole(@Body() dto: SetRoleDto) {
    return this.authService.validateRole(dto);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
