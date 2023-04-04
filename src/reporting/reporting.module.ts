import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { FireormModule } from 'nestjs-fireorm';
import { Reporting } from 'src/reporting/entities/reporting.entity';

@Module({
  imports: [FireormModule.forFeature([Reporting])],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
