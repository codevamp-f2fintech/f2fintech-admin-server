import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS globally
  app.enableCors({
    origin: [
      'http://localhost:3000',                // Local development
      'https://admin-f2fintech.netlify.app',  // Admin portal on Netlify
      'https://web.f2fintech.in',             // Main web application
      'https://admin.f2fintech.in'            // API domain on EC2
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Enable credentials (cookies/auth headers)
  });

  // Listen on port 3001 on all network interfaces
  await app.listen(3001, '0.0.0.0');
}

bootstrap();
