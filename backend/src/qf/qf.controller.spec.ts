import { Test, TestingModule } from '@nestjs/testing';
import { QfController } from './qf.controller';

describe('QfController', () => {
  let controller: QfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QfController],
    }).compile();

    controller = module.get<QfController>(QfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
