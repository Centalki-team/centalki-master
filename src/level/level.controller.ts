import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  CacheInterceptor,
  UseInterceptors,
  CacheTTL,
} from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { _1_MONTH_SECONDS_ } from 'src/global/constant';

@Controller('level')
@ApiTags('Level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo 1 cấp độ' })
  create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(_1_MONTH_SECONDS_)
  @ApiOperation({ summary: 'Lấy danh sách tất cả cấp độ' })
  findAll() {
    return this.levelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy 1 cấp độ theo id' })
  findOne(@Param('id') id: string) {
    return this.levelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa 1 cấp độ theo id' })
  update(@Param('id') id: string, @Body() updateLevelDto: UpdateLevelDto) {
    return this.levelService.update(id, updateLevelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa 1 cấp độ theo id' })
  remove(@Param('id') id: string) {
    return this.levelService.remove(id);
  }
}
