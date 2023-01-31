import {
  Controller,
  // Get,
  Post,
  Body,
  Param,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { SessionScheduleService } from './session-schedule.service';
import { CreateSessionScheduleDto } from './dto/create-session-schedule.dto';
import { PickUpDto } from './dto/pick-up.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { ESessionScheduleEvent } from './enum/session-schedule-event.enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { UpdateSessionScheduleDto } from './dto/update-session-schedule.dto';

@Controller('session-schedule')
@ApiTags('Session schedule')
export class SessionScheduleController {
  constructor(
    private readonly sessionScheduleService: SessionScheduleService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo 1 session schedule',
    description:
      'API dùng để tạo 1 session xếp lớp học khi học viên bấm nút bắt đầu học',
  })
  create(@Body() createSessionScheduleDto: CreateSessionScheduleDto) {
    return this.sessionScheduleService.create(createSessionScheduleDto);
  }

  @Post(':sessionId/pick-up')
  @ApiOperation({
    summary: 'Nhận lớp',
    description: 'Giáo viên nhận lớp',
  })
  pickUp(
    @Body() pickedUpDto: PickUpDto,
    @Param('sessionId') sessionId: string,
  ) {
    return this.sessionScheduleService.pickUp(sessionId, pickedUpDto);
  }

  @Post(':sessionId/cancel')
  @ApiOperation({
    summary: 'Hủy session schedule',
    description: 'API dùng để hủy 1 session xếp lớp học khi hết thời gian chờ mà không có giáo viên nào nhận hoặc khi học viên bấm nút hủy',
  })
  cancel(@Param('sessionId') sessionId: string) {
    return this.sessionScheduleService.cancel(sessionId);
  }

  @OnEvent(ESessionScheduleEvent.CREATED)
  handleOrderCreatedEvent(sessionId: string) {
    return this.sessionScheduleService.timeout(sessionId);
  }

  // @Get()
  // findAll() {
  //   return this.sessionScheduleService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.sessionScheduleService.findOne(+id);
  // }
}
