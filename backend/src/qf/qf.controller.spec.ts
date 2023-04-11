import { Test, TestingModule } from '@nestjs/testing';
import { QfController } from './qf.controller';
import { QfService } from './qf.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaService, qfService } from 'test/fixtures';

describe('QfController', () => {
  let controller: QfController;
  let service: QfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: QfService,
          useValue: qfService,
        },
      ],
      controllers: [QfController],
    }).compile();

    controller = module.get<QfController>(QfController);
    service = module.get<QfService>(QfService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
