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
import { ApiTags } from '@nestjs/swagger';
import { GetPhrasesDto } from './dto/get-phrases.dto';
import { PaginationResult } from 'src/global/types';
import { Phrase } from './entities/phrase.entity';

@Controller('phrase')
@ApiTags('Phrase')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  @Post()
  create(@Body() dto: CreatePhraseDto) {
    return this.phraseService.create(dto);
  }

  @Get()
  findAll(@Query() query: GetPhrasesDto): Promise<PaginationResult<Phrase>> {
    return this.phraseService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phraseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePhraseDto) {
    return this.phraseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phraseService.remove(id);
  }
}
