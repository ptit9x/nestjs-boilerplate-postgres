import { Module } from '@nestjs/common';
import { S3Service } from './s3.services';
import { MinioService } from './minio.services';

@Module({
  providers: [S3Service, MinioService],
  exports: [S3Service, MinioService],
})
export class UploadFileModule {}
