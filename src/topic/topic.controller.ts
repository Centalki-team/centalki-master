import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('topic')
@ApiTags('Topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  create(@Body() dto: CreateTopicDto) {
    return this.topicService.create(dto);
  }

  @Get()
  findAll() {
    return this.topicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.topicService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicService.remove(id);
  }
}
