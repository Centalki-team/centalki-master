import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';

@Module({
  imports: [HttpModule],
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class DictionaryModule {}
