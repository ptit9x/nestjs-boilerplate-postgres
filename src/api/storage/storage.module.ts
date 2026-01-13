import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { UploadFileModule } from 'src/share/upload-file';

@Module({
  imports: [UploadFileModule],
  providers: [],
  exports: [],
  controllers: [StorageController],
})
export class StorageModule {}
