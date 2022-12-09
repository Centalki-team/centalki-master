import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePresignedUrlDto } from './dto/create-presigned-url.dto';
import { StorageService } from './storage.service';

@Controller('storage')
@ApiTags('Storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}
  @Post('presigned-url')
  createPresignedUrl(@Body() dto: CreatePresignedUrlDto) {
    return this.storageService.generateV4UploadSignedUrl(dto);
  }
}
