import { Module, forwardRef } from '@nestjs/common';
import { AlgoliaService } from './algolia.service';
import { AlgoliaController } from './algolia.controller';
import { TopicModule } from 'src/topic/topic.module';

@Module({
  imports: [forwardRef(() => TopicModule)],
  providers: [AlgoliaService],
  exports: [AlgoliaService],
  controllers: [AlgoliaController],
})
export class AlgoliaModule {}
