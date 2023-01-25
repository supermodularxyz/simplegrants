import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import * as cuid from 'cuid';
import { randUser, randQuote, randUuid } from '@ngneat/falso';
import { UserProfile } from './users.interface';
import { CacheModule } from '@nestjs/common';

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

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      providers: [UsersService],
      exports: [UsersService],
      controllers: [UsersController],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('retrieveUserProfile', () => {
    it('should call prisma appropriately', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockResult);
      const result = await service.retrieveUserProfile(userId);

      expect(prisma.user.findUnique).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });

  describe('updateUserProfile', () => {
    it('should call prisma appropriately', async () => {
      jest.spyOn(prisma.user, 'update').mockResolvedValue(mockResult);
      const result = await service.updateUserProfile(userId, {
        name: 'Testing name',
        bio: 'New bio',
        twitter: 'newtwitter',
      });

      expect(prisma.user.update).toHaveBeenCalled();
      expect(result).toBe(mockResult);
    });
  });
});
