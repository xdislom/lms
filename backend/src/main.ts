import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from './common/config/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from "express"
// import { redis } from './common/config/redis';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection (process kept alive):', reason);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform:true
    })
  )

  app.use(
  '/uploads',
  express.static(join(process.cwd(), 'src/uploads')),
);

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,http://localhost:3000'
  ).split(',').map((origin) => origin.trim());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // await redis.connect();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap()
