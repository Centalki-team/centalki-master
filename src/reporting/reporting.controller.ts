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
import { FirebaseAuthGuard } from 'src/global/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/global/decorator';
import { UserRecord } from 'firebase-admin/auth';
import { CreateReportingDto } from 'src/reporting/dto/create-reporting.dto';
import { ReportingService } from 'src/reporting/reporting.service';
// import { UpdateBlockingDto } from './dto/update-blocking.dto';

@Controller('reporting')
@ApiTags('Reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateReportingDto, @User() user: UserRecord) {
    return this.reportingService.create(dto, user);
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
