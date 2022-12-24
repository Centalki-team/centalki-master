import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PhraseService } from './phrase.service';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { UpdatePhraseDto } from './dto/update-phrase.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPhrasesDto } from './dto/get-phrases.dto';
import { PaginationResult } from 'src/global/types';
import { Phrase } from './entities/phrase.entity';

@Controller('phrase')
@ApiTags('Phrase')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo 1 từ vựng' })
  create(@Body() dto: CreatePhraseDto) {
    return this.phraseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả từ vựng' })
  findAll(@Query() query: GetPhrasesDto): Promise<PaginationResult<Phrase>> {
    return this.phraseService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy 1 từ vựng theo id' })
  findOne(@Param('id') id: string) {
    return this.phraseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa 1 từ vựng theo id' })
  update(@Param('id') id: string, @Body() dto: UpdatePhraseDto) {
    return this.phraseService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa 1 từ vựng theo id' })
  remove(@Param('id') id: string) {
    return this.phraseService.remove(id);
  }
}
