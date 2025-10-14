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
  app.enableCors();
  await app.listen(process.env.PORT ?? 5001);
  console.log('NestJS backend listening on http://localhost:5001');
}
bootstrap();
