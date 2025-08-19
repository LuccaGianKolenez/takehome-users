import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return ok:true', () => {
      const res = appController.health();
      expect(res).toHaveProperty('ok', true);
      expect(typeof res.ts).toBe('number');
    });
  });
});
