import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/global/guard';
import { User } from 'src/global/decorator';
import { DecodedIdToken } from 'firebase-admin/auth';
import { GetFeedbacksDto } from './dto/get-feedbacks.dto';
import { PaginationResult } from 'src/global/types';
import { Feedback } from './entities/feedback.entity';
// import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedback')
@ApiTags('Feedback')
@UseGuards(FirebaseAuthGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @User() user: DecodedIdToken,
  ) {
    return this.feedbackService.create(user, createFeedbackDto);
  }

  @Get()
  findAll(
    @Query() query: GetFeedbacksDto,
  ): Promise<PaginationResult<Feedback>> {
    return this.feedbackService.findAll(query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.feedbackService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFeedbackDto: UpdateFeedbackDto,
  // ) {
  //   return this.feedbackService.update(+id, updateFeedbackDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}
