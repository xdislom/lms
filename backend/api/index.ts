import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module'
import express from 'express'

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  )

  app.enableCors();
  await app.init();
};

createNestServer(server)

export default server