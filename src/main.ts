import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const PORT = process.env.PORT || 8080;
  console.log("Starting Zentra Web Server...",PORT);
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  await app.listen(PORT, "0.0.0.0");
  console.log(`NestJS backend listening on http://localhost:${PORT}`);
}
bootstrap();
