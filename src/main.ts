import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 8080;

  console.log("Starting Zentra Web Server...", PORT);
  
  const app = await NestFactory.create(AppModule);

  // ✅ Allow all origins, all methods, all headers
  app.enableCors({
    origin: '*',          // allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',  // allow all headers
    credentials: false,   // set to true only if you need cookies/auth headers
  });

  await app.listen(PORT, '0.0.0.0');
  console.log(`✅ NestJS backend listening on http://localhost:${PORT}`);
}
bootstrap();
