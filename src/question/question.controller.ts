import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('question')
@ApiTags('Question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo 1 câu hỏi' })
  create(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả câu hỏi' })
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy 1 câu hỏi theo id' })
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa 1 câu hỏi theo id' })
  update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa 1 câu hỏi theo id' })
  remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }
}
