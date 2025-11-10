import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const PORT = process.env.PORT || 8080;

    // ✅ Explicit CORS configuration
  const allowedOrigins = [
    'https://streamayo-59yh-qg46ef8vu-rajs-projects-f379a685.vercel.app', // your frontend
    'http://localhost:3000', // for local testing
  ];


  console.log("Starting Zentra Web Server...",PORT);
  const app = await NestFactory.create(AppModule);

    app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(PORT, "0.0.0.0");
  console.log(`NestJS backend listening on http://localhost:${PORT}`);
}
bootstrap();
