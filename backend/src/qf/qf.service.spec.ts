import { Test, TestingModule } from '@nestjs/testing';
import { QfService } from './qf.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { prismaService } from 'test/fixtures';

describe('QfService', () => {
  let service: QfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QfService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<QfService>(QfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
