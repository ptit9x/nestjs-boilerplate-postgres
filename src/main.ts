import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import appConfig from './configs/server.config';
import nestOptions, { cloudwatchConfig } from './configs/nest-options.config';

const configService = new ConfigService();

async function bootstrap() {
  const app =
    cloudwatchConfig.accessKey && cloudwatchConfig.secretKey
      ? await NestFactory.create(AppModule, nestOptions)
      : await NestFactory.create(AppModule);
  appConfig(app);

  await app.listen(configService.get<number>('PORT') || 3000);
}

bootstrap();
