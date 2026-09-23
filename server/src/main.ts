import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : configService.get<number>('PORT') || 3001;
  const frontendUrl = process.env.FRONTEND_URL || configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

  // Parse cookies from incoming requests
  app.use(cookieParser());

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Global Exception Filter for clear JSON responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS with credentials support for frontend
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        frontendUrl,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
      ];

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
  });

  // Explicitly bind to '0.0.0.0' for Render / cloud container port detection
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Bespoke SaaS NestJS API running on: http://0.0.0.0:${port}/api`);
  logger.log(`📡 CORS credentials allowed for frontend: ${frontendUrl}`);
}

bootstrap();
