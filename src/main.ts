import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createServer } from 'http';
import { AppModule } from './app.module';
import socketInstance from './helpers/socket';
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const socketApp = express();
  app.setGlobalPrefix("api");
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const httpServer = createServer(socketApp);
  httpServer.listen(process.env.socketPort);
  socketInstance.connectSocket(httpServer);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
