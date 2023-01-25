import { Test, TestingModule } from '@nestjs/testing';
import { GrantsController } from './grants.controller';
import { CacheModule } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProviderModule } from 'src/provider/provider.module';
import { GrantsService } from './grants.service';
import { GrantDetailResponse, GrantResponse } from './grants.interface';
import {
  randCatchPhrase,
  randText,
  randImg,
  randUserName,
  randUrl,
  randCountry,
  randNumber,
  randUuid,
  randQuote,
  randUser,
} from '@ngneat/falso';
import { Role } from '@prisma/client';
import * as cuid from 'cuid';
import { UserProfile } from 'src/users/users.interface';

// Mock result
const mockResult: GrantResponse = {
  id: 'cld1dnt1y000008m97yakhtrf',
  name: randCatchPhrase(),
  description: randText(),
  image: randImg(),
  twitter: randUserName(),
  website: randUrl(),
  location: randCountry(),
  paymentAccountId: randUuid(),
  fundingGoal: randNumber({ min: 1000, max: 50000 }),
  verified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const extendedMockResult: GrantDetailResponse = {
  ...mockResult,
  contributions: [],
  team: [],
};

const userData = randUser();
const userId = cuid();
const mockUser: UserProfile = {
  id: userId,
  name: `${userData.firstName} ${userData.lastName}`,
  email: userData.email,
  emailVerified: null,
  visitorId: randUuid(),
  role: Role.User,
  flagged: false,
  image: userData.img,
  bio: randQuote(),
  twitter: userData.username,
  contributions: [
    {
      id: cuid(),
      userId: cuid(),
      grantId: cuid(),
      matchingRoundId: null,
      amount: 1000,
      denomination: 'USD',
      amountUsd: 1000,
      paymentMethodId: cuid(),
      flagged: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  grants: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { contributions, grants, ...userContext } = mockUser;

const serviceImplementation = {
  getAllGrants: jest.fn().mockImplementation(() => [mockResult]),
  createGrant: jest.fn().mockImplementation(() => mockResult),
  reviewGrant: jest.fn().mockImplementation(() => mockResult),
  getGrant: jest.fn().mockImplementation(() => extendedMockResult),
  updateGrant: jest.fn().mockImplementation(() => mockResult),
  resubmitGrant: jest.fn().mockImplementation(() => mockResult),
};

describe('GrantsController', () => {
  let controller: GrantsController;
  let service: GrantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        ProviderModule,
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      providers: [
        {
          provide: GrantsService,
          useValue: serviceImplementation,
        },
      ],
      controllers: [GrantsController],
    }).compile();

    controller = module.get<GrantsController>(GrantsController);
    service = module.get<GrantsService>(GrantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllGrants', () => {
    it('should call the service function appropriately', async () => {
      const result = await controller.getAllGrants({
        sort: '',
        filter: '',
        search: '',
      });

      expect(service.getAllGrants).toHaveBeenCalled();
      expect(result).toEqual([mockResult]);
    });
  });

  describe('createGrant', () => {
    it('should call the service function appropriately', async () => {
      const result = await controller.createGrant(
        {
          name: randCatchPhrase(),
          description: randText(),
          image: randImg(),
          twitter: randUserName(),
          website: randUrl(),
          location: randCountry(),
          paymentAccount: randUuid(),
          fundingGoal: randNumber({ min: 1000, max: 50000 }),
        },
        {
          user: userContext,
        },
      );

      expect(service.createGrant).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('reviewGrant', () => {
    it('should call the service function appropriately', async () => {
      const result = await controller.reviewGrant('grantId', {
        user: userContext,
      });

      expect(service.reviewGrant).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('getGrant', () => {
    it('should call the service function appropriately', async () => {
      const result = await controller.getGrant('grant ID', {
        user: userContext,
      });

      expect(service.getGrant).toHaveBeenCalled();
      expect(result).toEqual(extendedMockResult);
    });
  });

  describe('updateGrant', () => {
    it('should call the service function appropriately', async () => {
      const result = await controller.updateGrant(
        'grant ID',
        {
          name: randCatchPhrase(),
          description: randText(),
          image: randImg(),
          twitter: randUserName(),
          website: randUrl(),
          location: randCountry(),
        },
        {
          user: userContext,
        },
      );

      expect(service.updateGrant).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('resubmitGrant', () => {
    it('should call the service function appropriately', async () => {
      const result = await controller.resubmitGrant(
        'grant ID',
        {
          name: randCatchPhrase(),
          description: randText(),
          image: randImg(),
          twitter: randUserName(),
          website: randUrl(),
          location: randCountry(),
          paymentAccount: randUuid(),
          fundingGoal: randNumber({ min: 1000, max: 50000 }),
        },
        {
          user: userContext,
        },
      );

      expect(service.resubmitGrant).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});
