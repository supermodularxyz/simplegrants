import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { randUser, randUuid, randQuote } from '@ngneat/falso';
import { Role } from '@prisma/client';
import * as cuid from 'cuid';
import { UserProfile } from 'src/users/users.interface';

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

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      providers: [AuthService],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('grantAdminPrivilege', () => {
    it('should call the service function appropriately', async () => {
      jest
        .spyOn(service, 'grantAdminPrivilege')
        .mockImplementation(async () => mockResult);
      const result = await controller.grantAdminPrivilege(
        {
          id: userId,
        },
        {
          user: userContext,
        },
      );

      expect(service.grantAdminPrivilege).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe('revokeAdminPrivilege', () => {
    it('should call the service function appropriately', async () => {
      jest
        .spyOn(service, 'revokeAdminPrivilege')
        .mockImplementation(async () => mockResult);
      const result = await controller.revokeAdminPrivilege(
        {
          id: userId,
        },
        {
          user: userContext,
        },
      );

      expect(service.revokeAdminPrivilege).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });
});
