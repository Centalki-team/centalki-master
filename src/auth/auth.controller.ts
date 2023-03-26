import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Query,
  Put,
  UseInterceptors,
  CacheInterceptor,
  CacheTTL,
  // Inject,
  // forwardRef,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRecord } from 'firebase-admin/auth';
import { _1_DAY_SECONDS_, _30_MINS_MILLISECONDS_ } from 'src/global/constant';
import { User } from 'src/global/decorator';
import { FirebaseAuthGuard } from 'src/global/guard';
import { PaginateSessionDto } from 'src/session-schedule/dto/get-session.dto';
// import { SessionScheduleService } from 'src/session-schedule/session-schedule.service';
import { AuthService } from './auth.service';
import { PutInterestedTopics } from './dto/put-interested-topics.dto';
import { PutSpeakingLevels } from './dto/put-speaking-levels.dto';
import { SetDeviceTokenDto } from './dto/set-device-token.dto';
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
  // @UseInterceptors(CacheInterceptor)
  @ApiBearerAuth()
  // @CacheTTL(_30_MINS_MILLISECONDS_)
  @UseGuards(FirebaseAuthGuard)
  getSessions(@Query() query: PaginateSessionDto, @User() user: UserRecord) {
    return this.authService.paginateSessions(query, user);
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

  @Post('device-token')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({
    summary: 'Thêm device token',
    description: 'Thêm device token cho người dùng',
  })
  @ApiBearerAuth()
  addDeviceToken(@Body() dto: SetDeviceTokenDto, @User() user: UserRecord) {
    return this.authService.addDeviceToken(user, dto);
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

  @Put('speaking-levels')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({
    summary: 'Update speaking levels',
  })
  @ApiBearerAuth()
  putSpeakingLevels(@Body() dto: PutSpeakingLevels, @User() user: UserRecord) {
    return this.authService.putSpeakingLevels(user, dto);
  }

  @Put('interested-topics')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({
    summary: 'Update chủ đề yêu thích',
  })
  @ApiBearerAuth()
  putInterestedTopics(
    @Body() dto: PutInterestedTopics,
    @User() user: UserRecord,
  ) {
    return this.authService.putInterestedTopics(user, dto);
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
