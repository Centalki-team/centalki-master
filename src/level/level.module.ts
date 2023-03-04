import { CacheModule, Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Level } from './entities/level.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    FireormModule.forFeature([Level]),
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
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService],
})
export class LevelModule {}
