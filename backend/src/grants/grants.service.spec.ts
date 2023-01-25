import { Test, TestingModule } from '@nestjs/testing';
import { GrantsService } from './grants.service';
import { CacheModule, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ExtendedGrant,
  GrantFilterOptions,
  GrantSortOptions,
} from './grants.interface';
import {
  randText,
  randImg,
  randUserName,
  randUrl,
  randCountry,
  randUuid,
  randUser,
  randQuote,
} from '@ngneat/falso';
import { Role } from '@prisma/client';
import * as cuid from 'cuid';
import { UserProfile } from 'src/users/users.interface';
import { ProviderService } from 'src/provider/provider.service';

const userData = randUser();
const userId = cuid();
const mockUser: UserProfile = {
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

const anotherMockUser = {
  ...mockUser,
  id: 'anotheruser',
};

const mockGrants: ExtendedGrant[] = [
  {
    id: 'cld1dnt1y000008m97yakhtrf',
    name: 'test one',
    description: randText(),
    image: randImg(),
    twitter: randUserName(),
    website: randUrl(),
    location: randCountry(),
    paymentAccountId: randUuid(),
    fundingGoal: 100,
    contributions: [
      {
        id: randUuid(),
        userId: randUuid(),
        amount: 100,
        denomination: 'USD',
        amountUsd: 100,
        grantId: 'cld1dnt1y000008m97yakhtrf',
        matchingRoundId: null,
        paymentMethodId: randUuid(),
        flagged: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    team: [mockUser],
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cld1dnt1y000008m97yakhtrj',
    name: 'test two',
    description: randText(),
    image: randImg(),
    twitter: randUserName(),
    website: randUrl(),
    location: randCountry(),
    paymentAccountId: randUuid(),
    fundingGoal: 100,
    contributions: [
      {
        id: randUuid(),
        userId: randUuid(),
        amount: 50,
        denomination: 'USD',
        amountUsd: 50,
        grantId: 'cld1dnt1y000008m97yakhtrj',
        matchingRoundId: null,
        paymentMethodId: randUuid(),
        flagged: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    team: [],
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const unverifiedGrant: ExtendedGrant = {
  id: 'cld1dnt1y000008m97yakhtrl',
  name: 'test one',
  description: randText(),
  image: randImg(),
  twitter: randUserName(),
  website: randUrl(),
  location: randCountry(),
  paymentAccountId: randUuid(),
  fundingGoal: 100,
  contributions: [],
  team: [anotherMockUser],
  verified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { contributions, grants, ...userContext } = mockUser;

const grantQuery = {
  sort: GrantSortOptions.NEWEST,
  filter: GrantFilterOptions.FUNDED,
  search: 'test',
};

const prismaService = {
  grant: {
    findMany: jest.fn().mockResolvedValue(mockGrants),
    findUnique: jest.fn().mockResolvedValue(mockGrants[0]),
    create: jest.fn().mockResolvedValue(mockGrants[0]),
    update: jest.fn().mockResolvedValue(mockGrants[0]),
  },
};

const providerService = {
  getProvider: jest.fn().mockResolvedValue({
    id: '1',
  }),
};

describe('GrantsService', () => {
  let service: GrantsService;
  let prisma: PrismaService;

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
          provide: ProviderService,
          useValue: providerService,
        },
        GrantsService,
      ],
    }).compile();

    service = module.get<GrantsService>(GrantsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkGrantOwnership', () => {
    it('should show that user is team member of grant', () => {
      expect(service.checkGrantOwnership(mockGrants[0], mockUser)).toEqual(
        true,
      );
    });

    it('should throw error as user is not team member of grant', async () => {
      await expect(async () =>
        service.checkGrantOwnership(mockGrants[1], mockUser),
      ).rejects.toEqual(
        new HttpException('No edit rights', HttpStatus.FORBIDDEN),
      );
    });
  });

  describe('parseSorting', () => {
    it('should return the correct prisma input for GrantSortOptions.NEWEST', () => {
      expect(service.parseSorting(GrantSortOptions.NEWEST)).toEqual({
        createdAt: 'desc',
      });
    });

    it('should return the correct prisma input for GrantSortOptions.OLDEST', () => {
      expect(service.parseSorting(GrantSortOptions.OLDEST)).toEqual({
        createdAt: 'asc',
      });
    });

    it('should return the correct prisma input for GrantSortOptions.MOST_BACKED', () => {
      expect(service.parseSorting(GrantSortOptions.MOST_BACKED)).toEqual({
        contributions: {
          _count: 'desc',
        },
      });
    });

    it('should return the correct prisma input for GrantSortOptions.MOST_FUNDED', () => {
      expect(service.parseSorting(GrantSortOptions.MOST_FUNDED)).toEqual(
        undefined,
      );
    });

    it('should return the correct prisma input for a random string', () => {
      expect(service.parseSorting('random')).toEqual(undefined);
    });
  });

  describe('getAllGrants', () => {
    it('should call prisma with the correct parameters', async () => {
      await service.getAllGrants({
        ...grantQuery,
        isVerified: true,
      });

      expect(prisma.grant.findMany).toHaveBeenCalledWith({
        where: {
          verified: true,
          name: {
            contains: 'test',
            mode: 'insensitive',
          },
        },
        include: {
          contributions: true,
          team: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should return the result of the findMany method', async () => {
      const result = await service.getAllGrants({
        sort: '',
        filter: '',
        search: '',
        isVerified: true,
      });
      expect(result).toEqual(mockGrants);
    });

    it('should filter the grants by funded', async () => {
      const result = await service.getAllGrants({
        ...grantQuery,
        isVerified: true,
      });
      expect(result).toEqual([mockGrants[0]]);
    });

    it('should filter the grants by underfunded', async () => {
      const result = await service.getAllGrants({
        ...grantQuery,
        filter: GrantFilterOptions.UNDERFUNDED,
        isVerified: true,
      });
      expect(result).toEqual([mockGrants[1]]);
    });

    it('should sort the grants by most funded', async () => {
      const result = await service.getAllGrants({
        sort: GrantSortOptions.MOST_FUNDED,
        filter: '',
        isVerified: true,
      });
      expect(result).toEqual(mockGrants);
    });
  });

  describe('getGrantById', () => {
    it('should call all functions appropriately', async () => {
      const result = await service.getGrantById('cld1dnt1y000008m97yakhtrf');

      expect(prisma.grant.findUnique).toBeCalled();
      expect(result).toEqual(mockGrants[0]);
    });
  });

  describe('getGrant', () => {
    it('should call all functions appropriately', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(mockGrants[0]);

      const result = await service.getGrant('cld1dnt1y000008m97yakhtrf', {
        ...userContext,
      });

      expect(service.getGrantById).toBeCalled();
      expect(prisma.grant.findUnique).toBeCalled();
      expect(result).toEqual(mockGrants[0]);
    });

    it('should handle NOT_FOUND appropriately', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(null);

      await expect(
        service.getGrant('random', {
          ...userContext,
        }),
      ).rejects.toEqual(
        new HttpException('Grant not found', HttpStatus.NOT_FOUND),
      );
      expect(service.getGrantById).toBeCalled();
      expect(prisma.grant.findUnique).toBeCalled();
    });

    it('should handle unauthorized access for unverified grant with basic user', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(unverifiedGrant);

      await expect(service.getGrant('random', undefined)).rejects.toEqual(
        new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED),
      );
      expect(service.getGrantById).toBeCalled();
      expect(prisma.grant.findUnique).toBeCalled();
    });

    it('should handle forbidden access for unverified grant with basic user', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(unverifiedGrant);

      await expect(
        service.getGrant('random', {
          ...userContext,
        }),
      ).rejects.toEqual(
        new HttpException('No edit rights', HttpStatus.FORBIDDEN),
      );
      expect(service.getGrantById).toBeCalled();
      expect(prisma.grant.findUnique).toBeCalled();
    });

    it('should allow admin to view an unverified grant', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(unverifiedGrant);

      expect(
        await service.getGrant('random', {
          ...userContext,
          role: Role.Admin,
        }),
      ).toEqual(unverifiedGrant);
      expect(service.getGrantById).toBeCalled();
      expect(prisma.grant.findUnique).toBeCalled();
    });

    it('should allow team member to view their own unverified grant', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(unverifiedGrant);

      expect(
        await service.getGrant('random', {
          ...userContext,
          id: 'anotheruser',
        }),
      ).toEqual(unverifiedGrant);
      expect(service.getGrantById).toBeCalled();
      expect(prisma.grant.findUnique).toBeCalled();
    });
  });

  describe('createGrant', () => {
    it('should return the expected value', async () => {
      expect(
        await service.createGrant(
          {
            name: 'test one',
            description: randText(),
            image: randImg(),
            twitter: randUserName(),
            website: randUrl(),
            location: randCountry(),
            paymentAccount: randUuid(),
            fundingGoal: 100,
          },
          {
            ...userContext,
          },
        ),
      ).toEqual(mockGrants[0]);
    });
  });

  describe('updateGrant', () => {
    it('should return the expected value', async () => {
      expect(
        await service.updateGrant(
          '1',
          {
            name: 'test one',
            description: randText(),
            image: randImg(),
            twitter: randUserName(),
            website: randUrl(),
            location: randCountry(),
          },
          {
            ...userContext,
          },
        ),
      ).toEqual(mockGrants[0]);
    });

    it("should throw error if grant doesn't exist", async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(null);

      await expect(
        service.updateGrant(
          '1',
          {
            name: 'test one',
            description: randText(),
            image: randImg(),
            twitter: randUserName(),
            website: randUrl(),
            location: randCountry(),
          },
          {
            ...userContext,
          },
        ),
      ).rejects.toThrow(
        new HttpException('Grant not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should not allow non team member to edit grant', async () => {
      await expect(
        service.updateGrant(
          '1',
          {
            name: 'test one',
            description: randText(),
            image: randImg(),
            twitter: randUserName(),
            website: randUrl(),
            location: randCountry(),
          },
          {
            ...userContext,
            id: 'randomuser',
          },
        ),
      ).rejects.toThrow(
        new HttpException('No edit rights', HttpStatus.FORBIDDEN),
      );
    });
  });

  describe('resubmitGrant', () => {
    it('should return the expected value', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue({
        ...mockGrants[0],
        verified: false,
      });

      expect(
        await service.resubmitGrant(
          '1',
          {
            name: 'test one',
            description: randText(),
            image: randImg(),
            twitter: randUserName(),
            website: randUrl(),
            location: randCountry(),
            paymentAccount: randUuid(),
            fundingGoal: 100,
          },
          {
            ...userContext,
          },
        ),
      ).toEqual(mockGrants[0]);
    });

    it("should throw error if grant doesn't exist", async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(null);

      await expect(
        service.resubmitGrant(
          '1',
          {
            name: 'test one',
            description: randText(),
            image: randImg(),
            twitter: randUserName(),
            website: randUrl(),
            location: randCountry(),
            paymentAccount: randUuid(),
            fundingGoal: 100,
          },
          {
            ...userContext,
          },
        ),
      ).rejects.toThrow(
        new HttpException(
          'Grant cannot be resubmitted',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });

    it("should throw error if grant doesn't exist", async () => {
      await expect(
        service.resubmitGrant(
          '1',
          {
            name: 'test one',
            description: randText(),
            image: randImg(),
            twitter: randUserName(),
            website: randUrl(),
            location: randCountry(),
            paymentAccount: randUuid(),
            fundingGoal: 100,
          },
          {
            ...userContext,
          },
        ),
      ).rejects.toThrow(
        new HttpException(
          'Grant cannot be resubmitted',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });

    it('should not allow non team member to resubmit grant', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue({
        ...mockGrants[0],
        verified: false,
      });

      await expect(
        service.resubmitGrant(
          '1',
          {
            name: 'test one',
            description: randText(),
            image: randImg(),
            twitter: randUserName(),
            website: randUrl(),
            location: randCountry(),
            paymentAccount: randUuid(),
            fundingGoal: 100,
          },
          {
            ...userContext,
            id: 'randomuser',
          },
        ),
      ).rejects.toThrow(
        new HttpException('No edit rights', HttpStatus.FORBIDDEN),
      );
    });
  });

  describe('reviewGrant', () => {
    it('should allow not allow basic user to review', async () => {
      await expect(
        service.reviewGrant('1', {
          ...userContext,
        }),
      ).rejects.toThrow(
        new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should allow admin to review', async () => {
      expect(
        await service.reviewGrant('1', {
          ...userContext,
          role: Role.Admin,
        }),
      ).toEqual(mockGrants[0]);
    });
  });
});
