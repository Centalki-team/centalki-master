import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { FirebaseModule } from '../firebase/firebase.module';
// import { CommonModule } from '../common/common.module';

@Module({
  imports: [FirebaseModule],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
