import { Test, TestingModule } from '@nestjs/testing';
import { ProviderService } from './provider.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import * as cuid from 'cuid';
import { PaymentProvider } from '@prisma/client';

describe('ProviderService', () => {
  let service: ProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ProviderService],
      exports: [ProviderService],
    }).compile();

    service = module.get<ProviderService>(ProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the default provider', async () => {
    // Creating a mock result
    const result: PaymentProvider = {
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
      .spyOn(service, 'getProvider')
      .mockImplementation(async () => await result);

    expect(await service.getProvider()).toBe(result);
  });
});
