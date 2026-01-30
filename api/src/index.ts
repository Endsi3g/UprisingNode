import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export default async function handler(req: any, res: any) {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Adjust for production security later
    credentials: true,
  });
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
  return expressApp(req, res);
}
