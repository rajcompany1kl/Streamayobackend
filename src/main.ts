import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Serve HLS static files from /hls
  app.use('/hls', express.static(join(__dirname, '..', 'hls'), {
    setHeaders: (res, path) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }));
  app.use('/thumbnails', express.static(join(__dirname, '..', 'thumbnails'), {
    setHeaders: (res, path) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }));
  app.enableCors();
  await app.listen(8080, "0.0.0.0");
  console.log('NestJS backend listening on http://localhost:8080');
}
bootstrap();
