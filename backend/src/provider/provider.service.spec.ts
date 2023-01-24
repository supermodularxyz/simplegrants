import { Test, TestingModule } from '@nestjs/testing';
import { ProviderService } from './provider.service';
import * as cuid from 'cuid';
import { PaymentProvider } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('ProviderService', () => {
  let service: ProviderService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ProviderService],
      exports: [ProviderService],
    }).compile();

    service = module.get<ProviderService>(ProviderService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the default provider', async () => {
    // Creating a mock result
    const mockResult: PaymentProvider = {
      id: cuid(),
      name: 'Default Provider',
      type: 'CARD',
      acceptedCountries: ['US', 'MY'],
      denominations: ['USD'],
      website: 'https://stripe.com/docs/api',
      schema: {},
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(prisma.paymentProvider, 'findFirst')
      .mockResolvedValue(mockResult);

    const result = await service.getProvider();
    expect(prisma.paymentProvider.findFirst).toHaveBeenCalled();
    expect(result).toBe(mockResult);
  });
});
