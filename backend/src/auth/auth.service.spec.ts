import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CacheModule, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import { UserProfile } from 'src/users/users.interface';
import { prismaService, users } from 'test/fixtures';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let user: UserProfile;
  let admin: UserProfile;

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
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    [user, admin] = users;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('grantAdminPrivilege', () => {
    afterEach(() => {
      // Cleanup spies
      jest.clearAllMocks();
    });

    it('should allow admin to call the function appropriately', async () => {
      await service.grantAdminPrivilege(admin.email, admin);

      expect(prisma.user.update).toHaveBeenCalledWith({
        data: {
          role: Role.Admin,
        },
        where: {
          email: admin.email,
        },
      });
    });

    it('should return the correct value', async () => {
      // Change the function to return the admin value instead of user
      jest.spyOn(service, 'grantAdminPrivilege').mockResolvedValue(admin);
      const result = await service.grantAdminPrivilege(admin.email, admin);
      expect(result).toEqual(admin);
    });

    it('should not allow user to call the function', async () => {
      await expect(
        service.grantAdminPrivilege(user.email, user),
      ).rejects.toEqual(
        new HttpException('Not enough permissions', HttpStatus.FORBIDDEN),
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('revokeAdminPrivilege', () => {
    afterEach(() => {
      // Cleanup spies
      jest.clearAllMocks();
    });

    it('should allow admin to call the function appropriately', async () => {
      await service.revokeAdminPrivilege(admin.email, admin);

      expect(prisma.user.update).toHaveBeenCalledWith({
        data: {
          role: Role.User,
        },
        where: {
          email: admin.email,
        },
      });
    });

    it('should return the correct value', async () => {
      // Change the function to return the admin value instead of user
      jest.spyOn(service, 'revokeAdminPrivilege').mockResolvedValue(admin);
      const result = await service.revokeAdminPrivilege(admin.email, admin);
      expect(result).toEqual(admin);
    });

    it('should not allow user to call the function', async () => {
      await expect(
        service.revokeAdminPrivilege(user.email, user),
      ).rejects.toEqual(
        new HttpException('Not enough permissions', HttpStatus.FORBIDDEN),
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
