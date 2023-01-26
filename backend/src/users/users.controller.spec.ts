import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CacheModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { prismaService, users, usersService } from 'test/fixtures';
import { UserProfile } from './users.interface';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let user: UserProfile;
  let userContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
      ],
      controllers: [UsersController],
      providers: [
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    [user] = users;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contributions, grants, ...context } = user;
    userContext = context;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('retrieveUserProfile', () => {
    it('should call the service function appropriately', async () => {
      await controller.getProfile({
        user: userContext,
      });

      expect(service.retrieveUserProfile).toHaveBeenCalledWith(userContext.id);
    });

    it('should return the correct value', async () => {
      const result = await controller.getProfile({
        user: userContext,
      });
      expect(result).toEqual(user);
    });
  });

  describe('updateProfile', () => {
    const data = {
      name: 'Testing name',
      bio: 'New bio',
      twitter: 'newtwitter',
    };

    it('should call the service function appropriately', async () => {
      await controller.updateProfile(
        {
          user: userContext,
        },
        data,
      );

      expect(service.updateUserProfile).toHaveBeenCalledWith(
        userContext.id,
        data,
      );
    });

    it('should return the correct value', async () => {
      const result = await controller.updateProfile(
        {
          user: userContext,
        },
        data,
      );
      expect(result).toEqual(user);
    });
  });
});
