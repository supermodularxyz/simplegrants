import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CacheModule } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from './users.service';
import { randUser, randUuid, randQuote } from '@ngneat/falso';
import { Role } from '@prisma/client';
import * as cuid from 'cuid';
import { UserProfile } from './users.interface';

// Creating a mock result
const userData = randUser();
const userId = cuid();
const mockResult: UserProfile = {
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
const { contributions, grants, ...userContext } = mockResult;

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService],
      exports: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('retrieveUserProfile', () => {
    it('should retrieve the user based on request', async () => {
      jest
        .spyOn(service, 'retrieveUserProfile')
        .mockImplementation(async () => mockResult);
      const result = await controller.getProfile({
        user: userContext,
      });

      expect(service.retrieveUserProfile).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateProfile', () => {
    it('should update the user based on request and body', async () => {
      jest
        .spyOn(service, 'updateUserProfile')
        .mockImplementation(async () => mockResult);
      const result = await controller.updateProfile(
        {
          user: userContext,
        },
        {
          name: 'Testing name',
          bio: 'New bio',
          twitter: 'newtwitter',
        },
      );

      expect(service.updateUserProfile).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});
