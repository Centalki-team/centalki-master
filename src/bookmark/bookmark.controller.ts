import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/global/guard';
import { User } from 'src/global/decorator';
import { UserRecord } from 'firebase-admin/auth';
import { CreateTopicBookmarkDto } from 'src/bookmark/dto/create-topic-bookmark.dto';

@Controller('bookmark')
@ApiTags('Bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post('vocab')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo bookmark cho từ vựng',
  })
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @User() user: UserRecord,
  ) {
    return this.bookmarkService.create(createBookmarkDto, user);
  }

  @Get('vocab')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy bookmark cho từ vựng của user',
  })
  findAll(@User() user: UserRecord) {
    return this.bookmarkService.findAll(user);
  }

  @Get('vocab/:id')
  @ApiOperation({
    summary: 'Lấy chi tiết bookmark',
  })
  findOne(@Param('id') id: string) {
    return this.bookmarkService.findOne(id);
  }

  @Delete('vocab/:id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xoá bookmark',
  })
  remove(@Param('id') id: string, @User() user: UserRecord) {
    return this.bookmarkService.remove(id, user);
  }

  // ? Section for topic
  @Post('topic')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo bookmark cho chủ đề',
  })
  createTopicBookmark(
    @Body() createBookmarkDto: CreateTopicBookmarkDto,
    @User() user: UserRecord,
  ) {
    return this.bookmarkService.createTopicBookmark(createBookmarkDto, user);
  }

  @Get('topic')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy bookmark cho chủ đề của user',
  })
  findAllTopicBookmark(@User() user: UserRecord) {
    return this.bookmarkService.findAllTopicBookmark(user);
  }

  @Get('topic/:id')
  @ApiOperation({
    summary: 'Lấy chi tiết bookmark',
  })
  findOneTopicBookmark(@Param('id') id: string) {
    return this.bookmarkService.findOneTopicBookmark(id);
  }

  @Delete('topic/:id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xoá bookmark',
  })
  removeTopicBookmark(@Param('id') id: string, @User() user: UserRecord) {
    return this.bookmarkService.removeTopicBookmark(id, user);
  }
}
