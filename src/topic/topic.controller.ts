import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto, ImportJSONDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTopicsDto } from './dto/get-topics.dto';
import { OptionalFirebaseAuthGuard } from 'src/global/guard';
import { User } from 'src/global/decorator';
import { UserRecord } from 'firebase-admin/auth';

@Controller('topic')
@ApiTags('Topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo 1 chủ đề' })
  create(@Body() dto: CreateTopicDto) {
    return this.topicService.create(dto);
  }

  @Post('import-json')
  @ApiOperation({ summary: 'Tạo 1 chủ đề' })
  importJSON(@Body() dto: ImportJSONDto) {
    return this.topicService.importJSON(dto);
  }

  @Get()
  @UseGuards(OptionalFirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách chủ đề theo cấp độ' })
  findAll(@Query() query: GetTopicsDto, @User() user: UserRecord) {
    return this.topicService.getListTopic(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy 1 chủ đề theo id' })
  @UseGuards(OptionalFirebaseAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @User() user: UserRecord) {
    return this.topicService.findOne(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa 1 chủ đề theo id' })
  update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.topicService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa 1 chủ đề theo id' })
  remove(@Param('id') id: string) {
    return this.topicService.remove(id);
  }
}
