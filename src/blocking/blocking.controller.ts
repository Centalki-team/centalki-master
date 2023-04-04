import {
  Controller,
  // Get,
  Post,
  Body,
  UseGuards,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { BlockingService } from './blocking.service';
import { CreateBlockingDto } from './dto/create-blocking.dto';
import { FirebaseAuthGuard } from 'src/global/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/global/decorator';
import { UserRecord } from 'firebase-admin/auth';
// import { UpdateBlockingDto } from './dto/update-blocking.dto';

@Controller('blocking')
@ApiTags('Blocking')
export class BlockingController {
  constructor(private readonly blockingService: BlockingService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateBlockingDto, @User() user: UserRecord) {
    return this.blockingService.create(dto, user);
  }

  // @Get()
  // findAll() {
  //   return this.blockingService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.blockingService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateBlockingDto: UpdateBlockingDto,
  // ) {
  //   return this.blockingService.update(+id, updateBlockingDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.blockingService.remove(+id);
  // }
}
