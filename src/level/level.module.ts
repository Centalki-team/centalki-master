import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Level } from './entities/level.entity';

@Module({
  imports: [FireormModule.forFeature([Level])],
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService],
})
export class LevelModule {}
