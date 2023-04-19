import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserProfile } from './users.interface';
import {
  Contribution,
  EcosystemBuilder,
  Grant,
  MatchedFund,
  MatchingRound,
  User,
} from '@prisma/client';
import {
  UserProfileContributionInfo,
  UserProfileDonationInfo,
} from 'src/contributions/contributions.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private logger: LoggerService = new Logger(UsersService.name);

  calculateUserDonationMetrics(
    user: User & {
      contributions: (Contribution & {
        grant: Grant & {
          matchedFund: MatchedFund[];
          contributions: Contribution[];
        };
        matchingRound: MatchingRound;
      })[];
      grants: (Grant & { contributions: Contribution[] })[];
      ecosystemBuilder: EcosystemBuilder & {
        matchingRounds: (MatchingRound & { contributions: Contribution[] })[];
      };
    },
  ): UserProfile {
    /**
     * Now we need to calculate a few things
     * 1. Total donated amount - Amount they have contributed to all grants
     * 2. Total raised amount - Amount they have raised from all their owned grants
     * 3. Total contributed amount - Amount they have contributed to all pools
     * 4. Total pooled amount - Amount they have raised from all their owned pools
     *
     * Since we need to display the donations and grants in the frontend,
     * we might as well calculate them manually here
     *
     * There is also another thing we need to calculate, which is the matched amount.
     * This has to be computed by:
     * 1. Sum the total matched by grant
     * 2. Sum the total contribution of user by grant
     * 3. Divide the values to get an approximation of how much the user's
     *    contribution was matched to
     */
    const donations = user.contributions
      .filter((contribution) => contribution.grant)
      .reduce((prev, contribution) => {
        const grantIndex = prev.findIndex(
          (cont) => cont.grantId === contribution.grantId,
        );
        if (grantIndex === -1) {
          return [
            ...prev,
            {
              ...contribution,
              totalMatched: contribution.grant.matchedFund.reduce(
                (prev, fund) => prev + fund.amountUsd,
                0,
              ),
              totalDonated: contribution.grant.contributions.reduce(
                (prev, fund) => prev + fund.amountUsd,
                0,
              ),
            },
          ];
        } else {
          const temp = prev[grantIndex];

          prev[grantIndex] = {
            ...temp,
            amountUsd: temp.amountUsd + contribution.amountUsd,
            amount: temp.amount + contribution.amount,
          };

          return [...prev];
        }
      }, [] as UserProfileDonationInfo[]);

    const grants = user.grants.map((grant) => {
      return {
        ...grant,
        amountRaised: grant.contributions.reduce(
          (acc, contribution) => acc + contribution.amountUsd,
          0,
        ),
      };
    });

    /**
     * Now that we have all of these items, we can calculate the sum
     */
    const totalDonated = donations.reduce(
      (prev, donation) => prev + donation.amountUsd,
      0,
    );

    const totalRaised = grants.reduce(
      (prev, grant) => prev + grant.amountRaised,
      0,
    );

    let contributions,
      pools,
      totalContributed,
      totalPooled = undefined;

    if (user.ecosystemBuilder) {
      this.logger.log('User is an ecosystem builder 🌲');
      contributions = user.contributions
        .filter((contribution) => contribution.matchingRound)
        .reduce((prev, contribution) => {
          const matchingRoundIndex = prev.findIndex(
            (cont) => cont.matchingRoundId === contribution.matchingRoundId,
          );
          if (matchingRoundIndex === -1) {
            return [...prev, contribution];
          } else {
            const temp = prev[matchingRoundIndex];

            prev[matchingRoundIndex] = {
              ...temp,
              amountUsd: temp.amountUsd + contribution.amountUsd,
              amount: temp.amount + contribution.amount,
            };

            return [...prev];
          }
        }, [] as UserProfileContributionInfo[]);

      pools = user.ecosystemBuilder.matchingRounds.map((pool) => {
        return {
          ...pool,
          amountRaised: pool.contributions.reduce(
            (acc, contribution) => acc + contribution.amountUsd,
            0,
          ),
        };
      });

      totalContributed = contributions.reduce(
        (prev, contribution) => prev + contribution.amountUsd,
        0,
      );

      totalPooled = pools.reduce((prev, pool) => prev + pool.amountRaised, 0);
    }

    return {
      ...user,
      grants,
      donations,
      contributions,
      pools,
      totalDonated,
      totalRaised,
      totalContributed,
      totalPooled,
    };
  }

  async retrieveUserProfile(id: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        // Items I've donated to
        contributions: {
          include: {
            // Grants I've dontated to, we need to know how much we got matched
            grant: {
              include: {
                matchedFund: true,
                contributions: true, // This is to get all contributions by EVERYONE including myself
              },
            },
            // Pools I've donated to
            matchingRound: true,
          },
        },
        // Grants I've created
        grants: {
          include: {
            contributions: true, // How much they raised
          },
        },
        ecosystemBuilder: {
          include: {
            // Pools I've created
            matchingRounds: {
              include: {
                contributions: true, // How much they raised
              },
            },
          },
        },
      },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return this.calculateUserDonationMetrics(user);
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserProfile> {
    const user = await this.prisma.user.update({
      data: {
        ...data,
      },
      where: {
        id: userId,
      },
      include: {
        contributions: {
          include: {
            grant: {
              include: {
                matchedFund: true,
                contributions: true,
              },
            },
            matchingRound: true,
          },
        },
        grants: {
          include: {
            contributions: true,
          },
        },
        ecosystemBuilder: {
          include: {
            matchingRounds: {
              include: {
                contributions: true,
              },
            },
          },
        },
      },
    });

    return this.calculateUserDonationMetrics(user);
  }
}
