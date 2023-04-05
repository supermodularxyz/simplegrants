import { Test, TestingModule } from '@nestjs/testing';
import { QfService } from './qf.service';

describe('QfService', () => {
  let service: QfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QfService],
    }).compile();

    service = module.get<QfService>(QfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
