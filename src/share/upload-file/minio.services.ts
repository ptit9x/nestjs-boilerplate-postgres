import { Injectable } from '@nestjs/common';
import { MINIO_CONFIG } from 'src/configs/constant.config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: MINIO_CONFIG.HOST,
      port: 9000,
      useSSL: false,
      accessKey: MINIO_CONFIG.ACCESS_KEY,
      secretKey: MINIO_CONFIG.SECRET_KEY,
    });
  }

  uploadsFile(file: Express.Multer.File, fileName: string) {
    return this.client.putObject(
      MINIO_CONFIG.BUCKET_NAME,
      fileName,
      file.buffer,
    );
  }

  deleteFile(objectName: string) {
    return this.client.removeObject(MINIO_CONFIG.BUCKET_NAME, objectName);
  }

  getPreSignUrl(name: string) {
    return this.client.presignedPutObject(MINIO_CONFIG.BUCKET_NAME, name, 100);
  }
}
