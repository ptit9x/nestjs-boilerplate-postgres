import {
  ClassSerializerInterceptor,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_CONFIG, MINIO_CONFIG } from '../../configs/constant.config';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from 'src/share/upload-file/minio.services';
// import { S3Service } from 'src/share/upload-file';

@Controller({
  version: [API_CONFIG.VERSION_V1],
  path: 'storage',
})
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(
    private readonly minioService: MinioService,
    // private readonly s3Service: S3Service,
  ) {}

  @Get('/minio/presigned-url')
  @HttpCode(HttpStatus.OK)
  public async getPresignedUrl(): Promise<{ url: string }> {
    const url = await this.minioService.getPreSignUrl('test2.png');
    return {
      url,
    };
  }

  @Put('/minio/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadsFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }), // 1MB
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ url: string }> {
    const fileName = `${uuidv4()}.${file.originalname?.split('.').pop()}`;
    await this.minioService.uploadsFile(file, fileName);

    return {
      url: `${MINIO_CONFIG.ENDPOINT}/${MINIO_CONFIG.BUCKET_NAME}/${fileName}`,
    };
  }

  // @Put('/s3/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFileToS3(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
  //   const fileName = `${uuidv4()}.${file.originalname?.split('.').pop()}`;
  //   await this.s3Service.uploadsFile(file);

  //   return {
  //     url: `${MINIO_CONFIG.ENDPOINT}/${MINIO_CONFIG.BUCKET_NAME}/${fileName}`
  //   }
  // }
}
