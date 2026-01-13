import { Injectable } from '@nestjs/common';
import { AWS_CONFIG } from 'src/configs/constant.config';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/*
 * https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
 */
@Injectable()
export class S3Service {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: AWS_CONFIG.REGION,
      credentials: {
        accessKeyId: AWS_CONFIG.KEY_ID,
        secretAccessKey: AWS_CONFIG.ACCESS_KEY,
      },
    });
  }

  uploadsFile(file: Express.Multer.File, destination = 'images') {
    const params = new PutObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_ID,
      Key: destination + '/' + String(Date.now()) + '-' + file.originalname,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    return this.client.send(params);
  }

  async listFilesInBucket() {
    const command = new ListObjectsCommand({ Bucket: AWS_CONFIG.BUCKET_ID });
    const { Contents } = await this.client.send(command);
    return Contents;
  }

  async getPreSignUrl(path: string) {
    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_ID,
      Key: path,
    });
    return getSignedUrl(this.client, command, { expiresIn: 7200 });
  }

  async removeFile(path: string) {
    const command = new DeleteObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_ID,
      Key: path,
    });
    await this.client.send(command);
    return true;
  }
}
