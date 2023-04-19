import { Test, TestingModule } from '@nestjs/testing';
import { InvitesService } from './invites.service';
import { CacheModule, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  claimedInviteCode,
  inviteCode,
  prismaService,
  users,
} from 'test/fixtures';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserProfile } from 'src/users/users.interface';

describe('InvitesService', () => {
  let service: InvitesService;
  let prisma: PrismaService;
  let userA: UserProfile;
  let userB: UserProfile;

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
        InvitesService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<InvitesService>(InvitesService);
    prisma = module.get<PrismaService>(PrismaService);
    [userA, userB] = users;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('claimInviteCode', () => {
    it('should throw an error if ecosystem builder already exists', async () => {
      await expect(service.claimInviteCode('code', userA)).rejects.toThrow(
        new HttpException(
          'User already has an ecosystem builder account. Please login to the ecosystem builder platform.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should allow user to claim invite code', async () => {
      jest.spyOn(prisma.ecosystemBuilder, 'findUnique').mockResolvedValue(null);
      expect(await service.claimInviteCode('inviteCodeId', userB)).toEqual(
        claimedInviteCode,
      );
    });

    it('throw error if invite code is not found', async () => {
      jest.spyOn(prisma.inviteCodes, 'findUnique').mockResolvedValue(null);
      await expect(service.claimInviteCode('code', userA)).rejects.toThrow(
        new HttpException('Invalid invite code', HttpStatus.NOT_FOUND),
      );
    });

    it('throw error if invite code has been claimed before', async () => {
      jest.spyOn(prisma.inviteCodes, 'findUnique').mockResolvedValue({
        ...inviteCode,
        claimed: true,
      });

      await expect(service.claimInviteCode('code', userA)).rejects.toThrow(
        new HttpException(
          'Invite code already claimed',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });
  });
});
