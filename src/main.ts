import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS globally
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: [
      'http://localhost:3000',                // Local development
      'https://admin-f2fintech.netlify.app',  // Admin portal on Netlify
      'https://web.f2fintech.in/api/v1',
      'https://admin.f2fintech.in'            // API domain on EC2
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,  // Enable credentials (cookies/auth headers)
  });
  app.use(express.json());

  // Listen on port 3001 on all network interfaces
  await app.listen(3001, '0.0.0.0');
}

bootstrap();
