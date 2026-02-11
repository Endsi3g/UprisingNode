import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let appPromise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = NestFactory.create(AppModule).then((app) => {
      app.enableCors({
        origin: '*', // Adjust for production security later
        credentials: true,
      });
      return app.init();
    });
  }

  /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
  const app = await appPromise;
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}
