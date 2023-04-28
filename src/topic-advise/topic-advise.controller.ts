import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TopicAdviseService } from './topic-advise.service';
import { CreateTopicAdviseDto } from './dto/create-topic-advise.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/global/guard';
import { User } from 'src/global/decorator';
import { UserRecord } from 'firebase-admin/auth';

@Controller('topic-advise')
@ApiTags('Topic Advise')
export class TopicAdviseController {
  constructor(private readonly topicAdviseService: TopicAdviseService) {}

  @Post()
  @ApiOperation({
    summary: 'Góp ý chủ đề mới cho hệ thống',
  })
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createTopicAdviseDto: CreateTopicAdviseDto,
    @User() user: UserRecord,
  ) {
    return this.topicAdviseService.create(createTopicAdviseDto, user);
  }
}
