import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';

let server: Server;

async function bootstrap() {
  const PORT = process.env.PORT || 8080;

  // ✅ All allowed frontend origins (update if your preview URL changes)
  const allowedOrigins = [
    'https://streamayo-59yh.vercel.app',
    'https://streamayo-59yh-h2qjjrxvm-rajs-projects-f379a685.vercel.app',
    'https://streamayo-59yh-qg46ef8vu-rajs-projects-f379a685.vercel.app',
    'http://localhost:3000',
  ];

  console.log('🚀 Starting Zentra Web Server...', PORT);

  const app = await NestFactory.create(AppModule);

  // ✅ Explicit and safe CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  server = expressApp.listen(PORT, '0.0.0.0', () =>
    console.log(`✅ NestJS backend listening on port ${PORT}`)
  );
}

// Bootstrap once
bootstrap();

// ✅ Export handler for Vercel serverless compatibility
export default function handler(req, res) {
  if (!server) {
    console.log('⏳ Bootstrapping serverless NestJS instance...');
    bootstrap().then(() => {
      server.emit('request', req, res);
    });
  } else {
    server.emit('request', req, res);
  }
}
