import { Module } from '@nestjs/common';
import { BlockingService } from './blocking.service';
import { BlockingController } from './blocking.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Blocking } from 'src/blocking/entities/blocking.entity';

@Module({
  imports: [FireormModule.forFeature([Blocking])],
  controllers: [BlockingController],
  providers: [BlockingService],
})
export class BlockingModule {}
