import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserProfile } from './users.interface';
import { CacheModule } from '@nestjs/common';
import { prismaService, users } from 'test/fixtures';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let user: UserProfile;

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
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    [user] = users;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('retrieveUserProfile', () => {
    it('should call prisma appropriately', async () => {
      await service.retrieveUserProfile(user.id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
        include: {
          contributions: {
            include: {
              grant: true,
            },
          },
          grants: {
            include: {
              contributions: true,
            },
          },
        },
      });
    });

    it('should return the correct values', async () => {
      const result = await service.retrieveUserProfile(user.id);
      expect(result).toStrictEqual(user);
    });
  });

  describe('updateUserProfile', () => {
    const data = {
      name: 'Testing name',
      bio: 'New bio',
      twitter: 'newtwitter',
    };

    it('should call prisma appropriately', async () => {
      await service.updateUserProfile(user.id, data);

      expect(prisma.user.update).toHaveBeenCalledWith({
        data: {
          ...data,
        },
        where: {
          id: user.id,
        },
        include: {
          contributions: {
            include: {
              grant: true,
            },
          },
          grants: {
            include: {
              contributions: true,
            },
          },
        },
      });
    });

    it('should return the correct values', async () => {
      const result = await service.updateUserProfile(user.id, data);
      expect(result).toStrictEqual(user);
    });
  });
});
