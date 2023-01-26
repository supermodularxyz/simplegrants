import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CacheModule } from '@nestjs/common';
import { UserProfile } from 'src/users/users.interface';
import { authService, prismaService, users } from 'test/fixtures';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
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
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    [user] = users;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('grantAdminPrivilege', () => {
    it('should call the service function appropriately', async () => {
      await controller.grantAdminPrivilege(
        {
          id: user.id,
        },
        {
          user,
        },
      );

      expect(service.grantAdminPrivilege).toHaveBeenCalledWith(user.id, user);
    });

    it('should return the correct value', async () => {
      const result = await controller.grantAdminPrivilege(
        {
          id: user.id,
        },
        {
          user,
        },
      );

      expect(result).toEqual(user);
    });
  });

  describe('revokeAdminPrivilege', () => {
    it('should call the service function appropriately', async () => {
      await controller.revokeAdminPrivilege(
        {
          id: user.id,
        },
        {
          user,
        },
      );

      expect(service.revokeAdminPrivilege).toHaveBeenCalledWith(user.id, user);
    });

    it('should return the correct value', async () => {
      const result = await controller.grantAdminPrivilege(
        {
          id: user.id,
        },
        {
          user,
        },
      );

      expect(result).toEqual(user);
    });
  });
});
