import { Module } from '@nestjs/common';
import { PhraseService } from './phrase.service';
import { PhraseController } from './phrase.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Phrase } from './entities/phrase.entity';
import { DictionaryModule } from '../dictionary/dictionary.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [FireormModule.forFeature([Phrase]), DictionaryModule, CommonModule],
  controllers: [PhraseController],
  providers: [PhraseService],
  exports: [PhraseService],
})
export class PhraseModule {}
