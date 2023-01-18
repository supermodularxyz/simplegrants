import { Test, TestingModule } from '@nestjs/testing';
import { GrantsController } from './grants.controller';

describe('GrantsController', () => {
  let controller: GrantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrantsController],
    }).compile();

    controller = module.get<GrantsController>(GrantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
