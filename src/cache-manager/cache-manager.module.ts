import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheManagerService } from './cache-manager.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          url: configService.get('redisURI'),
          isGlobal: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
