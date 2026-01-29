import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
describe('AppController', () => {
  let appController: AppController;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  describe('root', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    it('should return "Hello World!"', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
