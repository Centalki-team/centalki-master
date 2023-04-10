import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTopicsDto } from './dto/get-topics.dto';
import { _1_DAY_SECONDS_ } from 'src/global/constant';

@Controller('topic')
@ApiTags('Topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo 1 chủ đề' })
  create(@Body() dto: CreateTopicDto) {
    return this.topicService.create(dto);
  }

  @Get()
  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(_1_DAY_SECONDS_)
  @ApiOperation({ summary: 'Lấy danh sách chủ đề theo cấp độ' })
  findAll(@Query() query: GetTopicsDto) {
    if (query.keyword) {
      return this.topicService.searchTopic(query);
    }
    return this.topicService.findAll(query);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(_1_DAY_SECONDS_)
  @ApiOperation({ summary: 'Lấy 1 chủ đề theo id' })
  findOne(@Param('id') id: string) {
    return this.topicService.findOne(id);
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
