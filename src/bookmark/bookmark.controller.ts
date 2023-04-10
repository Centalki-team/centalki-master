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

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateBookmarkDto: UpdateBookmarkDto,
  // ) {
  //   return this.bookmarkService.update(+id, updateBookmarkDto);
  // }

  @Delete('vocab/:id')
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xoá bookmark',
  })
  remove(@Param('id') id: string, @User() user: UserRecord) {
    return this.bookmarkService.remove(id, user);
  }
}
