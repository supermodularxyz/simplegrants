/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { GrantsController } from './grants.controller';
import { CacheModule } from '@nestjs/common';
import { GrantsService } from './grants.service';
import {
  CreateGrantDto,
  GrantFilterOptions,
  UpdateGrantDto,
} from './grants.interface';
import { UserProfile } from 'src/users/users.interface';
import {
  grants,
  grantsService,
  prismaService,
  providerService,
  users,
} from 'test/fixtures';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProviderService } from 'src/provider/provider.service';

describe('GrantsController', () => {
  let controller: GrantsController;
  let service: GrantsService;
  let user: UserProfile;
  let createGrant: CreateGrantDto;
  let updateGrant: UpdateGrantDto;

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
          provide: GrantsService,
          useValue: grantsService,
        },
        {
          provide: ProviderService,
          useValue: providerService,
        },
      ],
      controllers: [GrantsController],
    }).compile();

    controller = module.get<GrantsController>(GrantsController);
    service = module.get<GrantsService>(GrantsService);

    // Prep parameter data
    const [grant] = grants;
    const {
      id,
      createdAt,
      updatedAt,
      contributions,
      team,
      verified,
      ...createGrantBody
    } = grant;

    createGrant = {
      ...createGrantBody,
      paymentAccount: createGrantBody.paymentAccountId,
    };

    const { fundingGoal, paymentAccount, ...updateGrantBody } = createGrant;
    updateGrant = updateGrantBody;

    [user] = users;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllGrants', () => {
    const queries = {
      sort: '',
      filter: GrantFilterOptions.FUNDED,
      search: '',
    };

    it('should call the service function appropriately', async () => {
      await controller.getAllGrants(queries);

      expect(service.getAllGrants).toHaveBeenCalledWith({
        ...queries,
        isVerified: true,
      });
    });

    it('should return the correct value', async () => {
      const result = await controller.getAllGrants(queries);

      expect(result).toEqual(grants);
    });
  });

  describe('createGrant', () => {
    it('should call the service function appropriately', async () => {
      await controller.createGrant(createGrant, {
        user,
      });

      expect(service.createGrant).toHaveBeenCalledWith(createGrant, user);
    });

    it('should return the correct value', async () => {
      const result = await controller.createGrant(createGrant, {
        user,
      });

      expect(result).toEqual(grants[0]);
    });
  });

  describe('reviewGrant', () => {
    it('should call the service function appropriately', async () => {
      await controller.reviewGrant(grants[0].id, {
        user,
      });

      expect(service.reviewGrant).toHaveBeenCalledWith(grants[0].id, user);
    });

    it('should return the correct value', async () => {
      const result = await controller.reviewGrant(grants[0].id, {
        user,
      });

      expect(result).toEqual(grants[0]);
    });
  });

  describe('getGrant', () => {
    it('should call the service function appropriately', async () => {
      await controller.getGrant(grants[0].id, {
        user,
      });

      expect(service.getGrant).toHaveBeenCalledWith(grants[0].id, user);
    });

    it('should return the correct value', async () => {
      const result = await controller.getGrant(grants[0].id, {
        user,
      });

      expect(result).toEqual(grants[0]);
    });
  });

  describe('updateGrant', () => {
    it('should call the service function appropriately', async () => {
      await controller.updateGrant(grants[0].id, updateGrant, {
        user,
      });

      expect(service.updateGrant).toHaveBeenCalledWith(
        grants[0].id,
        updateGrant,
        user,
      );
    });

    it('should return the correct value', async () => {
      const result = await controller.updateGrant(grants[0].id, updateGrant, {
        user,
      });

      expect(result).toEqual(grants[0]);
    });
  });

  describe('resubmitGrant', () => {
    it('should call the service function appropriately', async () => {
      await controller.resubmitGrant(grants[0].id, createGrant, {
        user,
      });

      expect(service.resubmitGrant).toHaveBeenCalledWith(
        grants[0].id,
        createGrant,
        user,
      );
    });

    it('should return the correct value', async () => {
      const result = await controller.resubmitGrant(grants[0].id, createGrant, {
        user,
      });

      expect(result).toEqual(grants[0]);
    });
  });

  describe('checkoutGrants', () => {
    const checkoutItems = {
      grants: [
        {
          id: 'cld2ilh7t000008l3g1qe3nla',
          amount: 100,
        },
        {
          id: 'cld1dnt1y000008m97yakhtrf',
          amount: 200,
        },
      ],
    };
    it('should call the service function appropriately', async () => {
      await controller.checkoutGrants(checkoutItems, {
        user,
      });

      expect(service.checkoutGrants).toHaveBeenCalledWith(checkoutItems, user);
    });

    it('should return the correct properties', async () => {
      const result = await controller.checkoutGrants(checkoutItems, {
        user,
      });

      expect(result['url']).toBeDefined();
    });
  });
});
