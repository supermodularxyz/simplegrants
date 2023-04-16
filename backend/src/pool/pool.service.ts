import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  EcosystemBuilder,
  MatchingRound,
  Prisma,
  Role,
  User,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProviderService } from 'src/provider/provider.service';
import {
  CreatePoolDto,
  GetPoolDto,
  PoolFilterOptions,
  PoolResponse,
  PoolSortOptions,
  UpdatePoolDto,
} from './pool.interface';

@Injectable()
export class PoolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
  ) {}

  private paymentProvider = this.providerService.getProvider();

  /**
   * Throws error if not a member, otherwise returns true
   * @param pool
   * @param user
   * @returns `true` if is a team member
   */
  checkPoolOwnership(
    pool: MatchingRound & {
      funders: (EcosystemBuilder & { user: User })[];
    },
    user: User,
  ) {
    if (!pool.funders.some((member) => member.user.id === user.id))
      throw new HttpException('No edit rights', HttpStatus.FORBIDDEN);
    return true;
  }

  /**
   * Converts a basic sorting string to something Prisma can understand
   * @param sort Sorting option
   * @returns Prisma orderBy query object
   */
  parseSorting(sort: string): Prisma.MatchingRoundOrderByWithRelationInput {
    switch (sort) {
      case PoolSortOptions.NEWEST:
        return {
          createdAt: 'desc',
        };
      case PoolSortOptions.OLDEST:
        return {
          createdAt: 'asc',
        };
      // case PoolSortOptions.MOST_FUNDED: // Currently quite difficult with prisma
      //   return {
      //     createdAt: 'desc',
      //   };
      case PoolSortOptions.MOST_BACKED:
        return {
          contributions: {
            _count: 'desc',
          },
        };
    }
  }

  /**
   * Converts a basic filtering string to something Prisma can understand
   * @param filter Filtering option
   * @returns Prisma orderBy query object
   */
  parseFiltering(filter: string): Prisma.MatchingRoundWhereInput {
    switch (filter) {
      case PoolFilterOptions.ENDED:
        return {
          endDate: {
            lte: new Date(),
          },
        };
      case PoolFilterOptions.NOT_ENDED:
        return {
          endDate: {
            gt: new Date(),
          },
        };
    }
  }

  /**
   * To retrieve all pools from public route
   * @param data
   * @returns
   */
  async getAllPools(data: GetPoolDto) {
    const { isVerified, sort, filter, search } = data;

    let pools = await this.prisma.matchingRound.findMany({
      where: {
        verified: isVerified,
        name: {
          contains: search,
          mode: 'insensitive',
        },
        ...this.parseFiltering(filter),
      },
      include: {
        contributions: true,
      },
      orderBy: this.parseSorting(sort),
    });

    // Due to Prisma limitations, this is a workaround
    if (sort === PoolSortOptions.MOST_FUNDED) {
      pools = pools.sort((a, b) => {
        const aTotal = a.contributions.reduce(
          (acc, contribution) => acc + contribution.amountUsd,
          0,
        );
        const bTotal = b.contributions.reduce(
          (acc, contribution) => acc + contribution.amountUsd,
          0,
        );

        // Sort in descending order
        return bTotal - aTotal;
      });
    }
    return pools.map((pool) => {
      return {
        ...pool,
        amountRaised: pool.contributions.reduce(
          (acc, contribution) => acc + contribution.amountUsd,
          0,
        ),
      };
    });
  }

  /**
   * For internal use.
   * @note Also retrieves unverified pools
   * @param id ID of the pool to retrieve
   * @returns
   */
  async getPoolById(id: string) {
    return await this.prisma.matchingRound.findUnique({
      where: {
        id,
      },
      include: {
        contributions: true,
        funders: {
          include: {
            user: true,
          },
        },
        grants: {
          include: {
            contributions: true,
            team: true,
          },
        },
      },
    });
  }

  /**
   * Retrieve a pool by ID
   * @param id
   * @param user Used to check if the caller is the owner in the event
   * that the pool is still unverified to prevent leaking private info
   * @returns
   */
  async getPool(id: string, user: User) {
    const pool = await this.getPoolById(id);

    if (!pool) throw new HttpException('Pool not found', HttpStatus.NOT_FOUND);

    /**
     * If a pool is not verified, we need to do a few checks:
     * 1. Only admins can view unverified pools
     * 2. Only the pool owner can view their own unverified pool
     */
    user; // Do nothing with user for now
    // if (!pool.verified) {
    //   if (!user)
    //     throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    //   if (user.role !== Role.Admin) this.checkPoolOwnership(pool, user);
    // }

    // Now we need to calculate the number of unique contributors
    const uniqueUserIds = new Set<string>();

    for (const contribution of pool.contributions) {
      uniqueUserIds.add(contribution.userId);
    }

    return {
      ...pool,
      grants: pool.grants.map((pool) => {
        return {
          ...pool,
          amountRaised: pool.contributions.reduce(
            (acc, contribution) => acc + contribution.amountUsd,
            0,
          ),
        };
      }),
      team: pool.funders.map((funder) => funder.user),
      contributors: uniqueUserIds.size,
      amountRaised: pool.contributions.reduce(
        (acc, contribution) => acc + contribution.amountUsd,
        0,
      ),
    };
  }

  /**
   * Creates a pool with the provided data
   * @param data
   * @param user The owner to tie this pool to
   * @returns
   */
  async createPool(data: CreatePoolDto, user: User): Promise<PoolResponse> {
    const ecosystemBuilder = await this.prisma.ecosystemBuilder.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!ecosystemBuilder) {
      throw new HttpException(
        'User is not an ecosystem builder',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const pool = await this.prisma.matchingRound.create({
      data: {
        ...data,
        funders: {
          connect: [
            {
              id: ecosystemBuilder.id,
            },
          ],
        },
        grants: {
          connect: data.grants.map((grantId) => {
            return {
              id: grantId,
            };
          }),
        },
      },
    });

    return {
      ...pool,
      amountRaised: 0,
      contributions: [],
    };
  }

  /**
   * Only an admin can execute this function
   * The Admin role check should already be done by the guard,
   * but adding another check here in case the guard was bypassed
   * @param id
   * @param user
   * @returns
   */
  async reviewPool(id: string, user: User) {
    // First we validate if the user is an admin
    if (user.role !== Role.Admin)
      throw new HttpException('Unauthorized Access', HttpStatus.UNAUTHORIZED);

    return await this.prisma.matchingRound.update({
      data: {
        verified: true,
      },
      where: {
        id,
      },
    });
  }

  /**
   * Updates a pool
   * @param id
   * @param data
   * @param user Checks if caller is a team member that can edit this pool
   * @returns
   */
  async updatePool(id: string, data: UpdatePoolDto, user: User) {
    // Ensure only a team member can edit this pool
    const pool = await this.getPoolById(id);

    if (!pool) throw new HttpException('Pool not found', HttpStatus.NOT_FOUND);

    // Check if pool owner is calling this function
    this.checkPoolOwnership(pool, user);

    /**
     * Here is the funny part:
     * 1. We need to disconnect all of the old grants under this pool that we removed
     * 2. We need to connect the grants that we received from the data
     */
    const toRemove = pool.grants.filter(
      (grant) => !data.grants.includes(grant.id),
    );

    return await this.prisma.matchingRound.update({
      data: {
        ...data,
        grants: {
          connect: data.grants.map((grantId) => {
            return {
              id: grantId,
            };
          }),
          disconnect: toRemove.map((grant) => {
            return {
              id: grant.id,
            };
          }),
        },
      },
      where: {
        id,
      },
    });
  }
}
