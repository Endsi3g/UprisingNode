import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  await app.init();
  return app;
};

createNestServer(server)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .then((_v) => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err));

export default server;
