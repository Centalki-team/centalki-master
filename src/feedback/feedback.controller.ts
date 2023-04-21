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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/global/guard';
import { User } from 'src/global/decorator';
import { DecodedIdToken } from 'firebase-admin/auth';
import { GetFeedbacksDto } from './dto/get-feedbacks.dto';
import { PaginationResult } from 'src/global/types';
import { Feedback } from './entities/feedback.entity';
import { positive, negative } from './constant';
import { CreateStudentSessionFeedbackDto } from 'src/feedback/dto/create-student-session-feedback.dto';
import { CreateTeacherSessionFeedbackDto } from 'src/feedback/dto/create-teacher-session-feedback.dto';
// import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedback')
@ApiTags('Feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
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

  @Get('session/content/student')
  @ApiOperation({
    summary: ' Lấy danh sách các option cho học viên chọn khi gửi feedback',
  })
  @ApiResponseProperty({
    example: {
      data: {
        positive,
        negative,
      },
    },
  })
  getSessionFeedbackContent() {
    return {
      data: {
        positive,
        negative,
      },
    };
  }

  @Post('session/student')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiResponseProperty({
    example: {
      sessionId: 'string',
      rating: 0,
      description: 'string',
      suggestForTeacher: 'string',
      notSatisfiedWith: ['adjd'],
      satisfiedWith: ['jdakdkdlSKAS'],
      id: '6dvZpHemU9tacrREqXIF',
    },
  })
  @ApiOperation({
    summary: 'API cho học viên review',
  })
  createStudentSessionFeedback(
    @Body() dto: CreateStudentSessionFeedbackDto,
    @User() user: DecodedIdToken,
  ) {
    return this.feedbackService.createStudentSessionFeedback(user, dto);
  }

  @Post('session/teacher')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiResponseProperty({
    example: {
      sessionId: 'string',
      pronunciation: 0,
      vocabularies: 0,
      grammar: 0,
      idea: 0,
      fluency: 0,
      description: 'string',
      suggest: 'string',
      id: '9mVU0gd5rBSzLJ68Sdb4',
    },
  })
  createTeacherSessionFeedback(
    @User() user: DecodedIdToken,
    @Body() dto: CreateTeacherSessionFeedbackDto,
  ) {
    return this.feedbackService.createTeacherSessionFeedback(user, dto);
  }
}
