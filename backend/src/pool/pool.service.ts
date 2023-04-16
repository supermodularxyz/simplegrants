import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProviderService } from 'src/provider/provider.service';
import {
  BasicPoolResponse,
  CreatePoolDto,
  GetPoolDto,
  PoolFilterOptions,
  PoolResponse,
  PoolSortOptions,
} from './pool.interface';

@Injectable()
export class PoolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly providerService: ProviderService,
  ) {}

  private paymentProvider = this.providerService.getProvider();

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
}
