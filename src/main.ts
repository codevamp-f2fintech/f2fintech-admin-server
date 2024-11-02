import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS globally
  app.enableCors({
    origin: ['http://localhost:3000', 'https://admin-f2fintech.netlify.app', "https://web.f2fintech.in/api/v1"], // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Set to true if you need to allow cookies or authentication headers
  });
  await app.listen(3001);
}
bootstrap();
