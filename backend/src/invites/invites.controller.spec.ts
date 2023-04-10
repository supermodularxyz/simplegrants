import { Test, TestingModule } from '@nestjs/testing';
import { InvitesController } from './invites.controller';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { InvitesService } from './invites.service';
import { invitesService, prismaService, users } from 'test/fixtures';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheModule } from '@nestjs/common';
import { UserProfile } from 'src/users/users.interface';

describe('InvitesController', () => {
  let controller: InvitesController;
  let service: InvitesService;
  let user: UserProfile;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10,
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: InvitesService,
          useValue: invitesService,
        },
      ],
      controllers: [InvitesController],
    }).compile();

    controller = module.get<InvitesController>(InvitesController);
    service = module.get<InvitesService>(InvitesService);

    [user] = users;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('claimInviteCode', () => {
    it('should call the service function appropriately', async () => {
      const code = 'clfsbx7bb0000pd0kjloobn8a';
      await controller.claimInviteCode(code, {
        user,
      });

      expect(service.claimInviteCode).toHaveBeenCalledWith(code, user);
    });

    it('should return the correct value', async () => {
      const code = 'clfsbx7bb0000pd0kjloobn8a';
      const result = await controller.claimInviteCode(code, {
        user,
      });

      expect(result).toEqual({
        code,
        claimed: true,
      });
    });
  });
});
