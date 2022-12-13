import {
  ClassSerializerInterceptor,
  INestApplication,
  VersioningType,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import { HttpExceptionFilter } from 'src/share/filter/http-exception.filter';
import { TransformInterceptor } from 'src/share/interceptors/transform.interceptor';

export default function (app: INestApplication) {
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'api/v',
  });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(json({ limit: '8mb' }));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('BLUEONION')
      .setDescription('APIs documents for BLUEONION')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
}
