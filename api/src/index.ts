/* eslint-disable */
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);

let appPromise: Promise<any>;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors();
  await app.init();
  return app;
}

export default async (req: any, res: any) => {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  await appPromise;
  const app = await appPromise;
  // ExpressAdapter directly wraps the express instance
  adapter.getInstance()(req, res);
};
