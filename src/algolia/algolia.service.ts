import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import algoliasearch, { SearchClient } from 'algoliasearch';
// import { GetPaginationParams } from 'src/global/class';
import { GetTopicsDto } from 'src/topic/dto/get-topics.dto';
import { Topic } from 'src/topic/entities/topic.entity';
import { TopicService } from 'src/topic/topic.service';

@Injectable()
export class AlgoliaService {
  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => TopicService))
    private topicService: TopicService,
  ) {
    this.algoliaClient = algoliasearch(
      this.configService.getOrThrow('applicationId'),
      this.configService.getOrThrow('adminKey'),
    );
    // setTimeout(() => {
    //   this.searchTopic({
    //     categoryId: '98VWwgv1cK3N05IR0Lfk',
    //     levelId: 'RA9HlzOCHavBC7UTVHjO',
    //   });
    // }, 1500);

    // setTimeout(() => {
    //   this.importTopicsToAlgolia();
    // }, 10000);
  }

  algoliaClient: SearchClient;

  async importTopicsToAlgolia() {
    const topics = await this.topicService.getTopicsForIndex();
    const topicIndex = this.algoliaClient.initIndex(
      this.configService.getOrThrow('topicIndexName'),
    );
    await topicIndex.setSettings({
      attributesForFaceting: ['filterOnly(categoryId)', 'filterOnly(levelId)'],
    });

    await topicIndex.clearObjects();

    const result = await topicIndex.saveObjects(topics, {
      autoGenerateObjectIDIfNotExist: true,
    });

    console.log(`importTopicsToAlgolia success`, { topics, result });
  }

  async searchTopic(query: GetTopicsDto): Promise<{ data: Topic[] }> {
    const topicIndex = this.algoliaClient.initIndex(
      this.configService.getOrThrow('topicIndexName'),
    );
    const facetFilters = [];
    if (query.categoryId) {
      facetFilters.push(`categoryId:${query.categoryId}`);
    }

    if (query.levelId) {
      facetFilters.push(`levelId:${query.levelId}`);
    }

    const result = await topicIndex.search<Topic>(query.keyword || '', {
      // page: query.page,
      // hitsPerPage: query.size,
      facetFilters,
      attributesToHighlight: [],
    });
    const hits = result.hits || [];
    return {
      data: hits,
    };
  }
}
