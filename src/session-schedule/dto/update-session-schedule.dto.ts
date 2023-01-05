import { PartialType } from '@nestjs/swagger';
import { CreateSessionScheduleDto } from './create-session-schedule.dto';

export class UpdateSessionScheduleDto extends PartialType(
  CreateSessionScheduleDto,
) {}
