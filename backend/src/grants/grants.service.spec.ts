/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { GrantsService } from './grants.service';
import { CacheModule, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateGrantDto,
  GrantFilterOptions,
  GrantSortOptions,
  UpdateGrantDto,
} from './grants.interface';
import { UserProfile } from 'src/users/users.interface';
import { ProviderService } from 'src/provider/provider.service';
import {
  awsService,
  checkoutItems,
  checkoutPaymentSession,
  grants,
  prismaService,
  providerService,
  users,
} from 'test/fixtures';
import * as _ from 'lodash';
import { AwsService } from 'src/aws/aws.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

const grantQuery = {
  sort: GrantSortOptions.NEWEST,
  filter: GrantFilterOptions.FUNDED,
  search: 'test',
};

describe('GrantsService', () => {
  let service: GrantsService;
  let prisma: PrismaService;
  let userA: UserProfile;
  let admin: UserProfile;
  let userB: UserProfile;
  let createGrant: CreateGrantDto;
  let updateGrant: UpdateGrantDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({
          isGlobal: true,
        }),
        NestjsFormDataModule.config({
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
        {
          provide: AwsService,
          useValue: awsService,
        },
        GrantsService,
      ],
    }).compile();

    service = module.get<GrantsService>(GrantsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Prep parameter data
    const [grant] = grants;
    const {
      id,
      createdAt,
      updatedAt,
      contributions,
      team,
      verified,
      ...createGrantBody
    } = grant;

    createGrant = {
      ...createGrantBody,
      paymentAccount: createGrantBody.paymentAccountId,
    };

    const { fundingGoal, paymentAccount, ...updateGrantBody } = createGrant;
    updateGrant = updateGrantBody;

    [userA, admin, userB] = users;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkGrantOwnership', () => {
    it('should show that user is team member of grant', () => {
      expect(service.checkGrantOwnership(grants[0], userA)).toEqual(true);
    });

    it('should throw error as user is not team member of grant', async () => {
      await expect(async () =>
        service.checkGrantOwnership(grants[1], userB),
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
    afterEach(() => {
      // Cleanup spies
      jest.clearAllMocks();
    });

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
      expect(result).toEqual(grants);
    });

    it('should filter the grants by funded', async () => {
      const result = await service.getAllGrants({
        ...grantQuery,
        isVerified: true,
      });
      expect(result).toEqual([grants[0]]);
    });

    it('should filter the grants by underfunded', async () => {
      const result = await service.getAllGrants({
        ...grantQuery,
        filter: GrantFilterOptions.UNDERFUNDED,
        isVerified: true,
      });
      expect(result).toEqual([grants[1], grants[2]]);
    });

    it('should sort the grants by most funded', async () => {
      const result = await service.getAllGrants({
        sort: GrantSortOptions.MOST_FUNDED,
        filter: '',
        isVerified: true,
      });
      expect(result).toEqual(grants);
    });
  });

  describe('getGrantById', () => {
    it('should call all functions appropriately', async () => {
      const result = await service.getGrantById(grants[0].id);

      expect(prisma.grant.findUnique).toBeCalled();
      expect(result).toEqual(grants[0]);
    });
  });

  describe('getGrant', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(grants[2]);
    });

    afterEach(() => {
      // Cleanup spies
      jest.clearAllMocks();
    });

    it('should call all functions appropriately', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(grants[0]);

      const result = await service.getGrant('cld1dnt1y000008m97yakhtrf', {
        ...userA,
      });

      expect(service.getGrantById).toBeCalled();
      expect(result).toEqual(grants[0]);
    });

    it('should handle NOT_FOUND appropriately', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(null);

      await expect(
        service.getGrant('random', {
          ...userA,
        }),
      ).rejects.toEqual(
        new HttpException('Grant not found', HttpStatus.NOT_FOUND),
      );
      expect(service.getGrantById).toBeCalled();
    });

    /**
     * This feature has been temporarily removed
     */
    // it('should handle unauthorized access for unverified grant with basic user', async () => {
    //   await expect(service.getGrant('random', undefined)).rejects.toEqual(
    //     new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED),
    //   );
    //   expect(service.getGrantById).toBeCalled();
    // });

    // it('should handle forbidden access for unverified grant with basic user', async () => {
    //   await expect(
    //     service.getGrant('random', {
    //       ...userA,
    //     }),
    //   ).rejects.toEqual(
    //     new HttpException('No edit rights', HttpStatus.FORBIDDEN),
    //   );
    //   expect(service.getGrantById).toBeCalled();
    // });

    // it('should allow admin to view an unverified grant', async () => {
    //   expect(
    //     await service.getGrant('random', {
    //       ...admin,
    //     }),
    //   ).toEqual(grants[2]);
    //   expect(service.getGrantById).toBeCalled();
    // });

    // it('should allow team member to view their own unverified grant', async () => {
    //   expect(
    //     await service.getGrant('random', {
    //       ...userB,
    //     }),
    //   ).toEqual(grants[2]);
    //   expect(service.getGrantById).toBeCalled();
    // });
  });

  describe('createGrant', () => {
    it('should return the expected value', async () => {
      expect(
        await service.createGrant(createGrant, {
          ...userA,
        }),
      ).toEqual(grants[0]);
    });
  });

  describe('updateGrant', () => {
    it('should return the expected value', async () => {
      expect(
        await service.updateGrant('id', createGrant, {
          ...userA,
        }),
      ).toEqual(grants[0]);
    });

    it("should throw error if grant doesn't exist", async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(null);

      await expect(
        service.updateGrant('id', updateGrant, {
          ...userA,
        }),
      ).rejects.toThrow(
        new HttpException('Grant not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should not allow non team member to edit grant', async () => {
      await expect(
        service.updateGrant('1', updateGrant, {
          ...userA,
          id: 'randomuser',
        }),
      ).rejects.toThrow(
        new HttpException('No edit rights', HttpStatus.FORBIDDEN),
      );
    });
  });

  describe('resubmitGrant', () => {
    afterEach(() => {
      // Cleanup spies
      jest.clearAllMocks();
    });

    it('should return the expected value', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue({
        ...grants[0],
        verified: false,
      });

      expect(
        await service.resubmitGrant('1', createGrant, {
          ...userA,
        }),
      ).toEqual(grants[0]);
    });

    it("should throw error if grant doesn't exist", async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue(null);

      await expect(
        service.resubmitGrant('1', createGrant, {
          ...userA,
        }),
      ).rejects.toThrow(
        new HttpException(
          'Grant cannot be resubmitted',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });

    it("should throw error if grant doesn't exist", async () => {
      await expect(
        service.resubmitGrant('1', createGrant, {
          ...userA,
        }),
      ).rejects.toThrow(
        new HttpException(
          'Grant cannot be resubmitted',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });

    it('should not allow non team member to resubmit grant', async () => {
      jest.spyOn(service, 'getGrantById').mockResolvedValue({
        ...grants[0],
        verified: false,
      });

      await expect(
        service.resubmitGrant('1', createGrant, {
          ...userA,
          id: 'randomuser',
        }),
      ).rejects.toThrow(
        new HttpException('No edit rights', HttpStatus.FORBIDDEN),
      );
    });
  });

  describe('reviewGrant', () => {
    it('should allow not allow basic user to review', async () => {
      await expect(
        service.reviewGrant('1', {
          ...userA,
        }),
      ).rejects.toThrow(
        new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should allow admin to review', async () => {
      expect(
        await service.reviewGrant('1', {
          ...admin,
        }),
      ).toEqual(grants[0]);
    });
  });

  describe('checkoutGrants', () => {
    it('should call prisma with the appropriate values', async () => {
      await service.checkoutGrants(checkoutItems, {
        ...userB,
      });

      expect(prisma.grant.findMany).toBeCalledWith({
        where: {
          id: {
            in: checkoutItems.grants.map((grant) => grant.id),
          },
        },
        include: {
          paymentAccount: true,
        },
      });
    });

    it('should create a payment session', async () => {
      expect(
        await service.checkoutGrants(checkoutItems, {
          ...userB,
        }),
      ).toEqual(checkoutPaymentSession);
    });

    it('should not allow owner to create a payment session', async () => {
      await expect(
        service.checkoutGrants(checkoutItems, {
          ...userA,
        }),
      ).rejects.toThrow(
        new HttpException(
          'You cannot checkout your own grants!',
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
      );
    });
  });
});
