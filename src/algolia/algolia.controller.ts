import { Controller } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AlgoliaService } from 'src/algolia/algolia.service';

@Controller('algolia')
export class AlgoliaController {
  constructor(private algoliaService: AlgoliaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleImportTopicToAlgolia() {
    return this.algoliaService.importTopicsToAlgolia();
  }
}
