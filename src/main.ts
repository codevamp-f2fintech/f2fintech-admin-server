import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';
import * as express from 'express';

async function bootstrap () {
  const app = await NestFactory.create( AppModule );
  // Enable CORS globally
  app.use( json( { limit: '50mb' } ) );
  app.use( urlencoded( { limit: '50mb', extended: true } ) );
  app.enableCors( {
    origin: [ 'http://localhost:3000', 'https://admin-f2fintech.netlify.app', "http://localhost:5173", "https://f2fintech.com" ], // Allow requests from this origin
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  } );
  app.use( express.json() );
  await app.listen( 3001 );
}
bootstrap();
