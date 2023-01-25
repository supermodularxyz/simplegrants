import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CacheModule, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
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

const adminData = randUser();
const adminId = cuid();
const admin: UserProfile = {
  id: adminId,
  name: `${adminData.firstName} ${adminData.lastName}`,
  email: adminData.email,
  emailVerified: null,
  visitorId: randUuid(),
  role: Role.Admin,
  flagged: false,
  image: adminData.img,
  bio: randQuote(),
  twitter: adminData.username,
  contributions: [],
  grants: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { contributions: _c, grants: _g, ...adminContext } = admin;

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      providers: [AuthService],
      exports: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.spyOn(prisma.user, 'update').mockResolvedValue(mockResult);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('grantAdminPrivilege', () => {
    it('should allow admin to call the function', async () => {
      const result = await service.grantAdminPrivilege(adminId, adminContext);

      expect(prisma.user.update).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should not allow user to call the function', async () => {
      await expect(
        service.grantAdminPrivilege(userId, userContext),
      ).rejects.toEqual(
        new HttpException('Not enough permissions', HttpStatus.FORBIDDEN),
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('revokeAdminPrivilege', () => {
    it('should allow admin to call the function', async () => {
      const result = await service.revokeAdminPrivilege(adminId, adminContext);

      expect(prisma.user.update).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should not allow user to call the function', async () => {
      await expect(
        service.revokeAdminPrivilege(userId, userContext),
      ).rejects.toEqual(
        new HttpException('Not enough permissions', HttpStatus.FORBIDDEN),
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
