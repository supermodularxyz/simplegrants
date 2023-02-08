/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProviderController } from './provider.controller';
import { CacheModule } from '@nestjs/common';
import { UserProfile } from 'src/users/users.interface';
import {
  checkoutInfo,
  grants,
  grantsService,
  prismaService,
  providerService,
  users,
} from 'test/fixtures';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProviderService } from 'src/provider/provider.service';

describe('ProviderController', () => {
  let controller: ProviderController;
  let service: ProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: ProviderService,
          useValue: providerService,
        },
      ],
      controllers: [ProviderController],
    }).compile();

    controller = module.get<ProviderController>(ProviderController);
    service = module.get<ProviderService>(ProviderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('retrieveCheckoutInfo', () => {
    it('should call the service function appropriately', async () => {
      await controller.retrieveCheckoutInfo('sessionId');

      expect(service.retrieveCheckoutInfo).toHaveBeenCalledWith('sessionId');
    });

    it('should return the correct value', async () => {
      const result = await controller.retrieveCheckoutInfo('sessionId');

      expect(result).toEqual(checkoutInfo);
    });
  });
});
