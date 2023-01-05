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
// import { UpdateSessionScheduleDto } from './dto/update-session-schedule.dto';

@Controller('session-schedule')
export class SessionScheduleController {
  constructor(
    private readonly sessionScheduleService: SessionScheduleService,
  ) {}

  @Post()
  create(@Body() createSessionScheduleDto: CreateSessionScheduleDto) {
    return this.sessionScheduleService.create(createSessionScheduleDto);
  }

  @Post(':sessionId/pick-up')
  pickUp(
    @Body() pickedUpDto: PickUpDto,
    @Param('sessionId') sessionId: string,
  ) {
    return this.sessionScheduleService.pickUp(sessionId, pickedUpDto);
  }

  @Post(':sessionId/cancel')
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
