import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  await app.listen(8080, "0.0.0.0");
  console.log('NestJS backend listening on http://localhost:8080');
}
bootstrap();
