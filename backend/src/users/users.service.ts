import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserProfile } from './users.interface';
import { Contribution, Grant, MatchedFund, User } from '@prisma/client';
import { UserProfileContributionInfo } from 'src/contributions/contributions.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private logger: LoggerService = new Logger(UsersService.name);

  calculateUserDonationMetrics(
    user: User & {
      grants: (Grant & {
        contributions: Contribution[];
      })[];
      contributions: (Contribution & {
        grant: Grant & {
          contributions: Contribution[];
          matchedFund: MatchedFund[];
        };
      })[];
    },
  ): UserProfile {
    /**
     * Now we need to calculate total donated amount and total raised amount
     * 1. Total donated amount - Amount they have contributed to all grants
     * 2. Total raised amount - Amount they have raised from all their owned grants
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
    const contributions = user.contributions.reduce((prev, contribution) => {
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
              (prev, cont) => prev + cont.amountUsd,
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
    }, [] as UserProfileContributionInfo[]);

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
     * Now that we have both of these items, we can calculate the sum
     */
    const totalDonated = contributions.reduce(
      (prev, contribution) => prev + contribution.amountUsd,
      0,
    );

    const totalRaised = grants.reduce(
      (prev, grant) => prev + grant.amountRaised,
      0,
    );

    return {
      ...user,
      grants,
      contributions,
      totalDonated,
      totalRaised,
    };
  }

  async retrieveUserProfile(id: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
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
          },
        },
        grants: {
          include: {
            contributions: true,
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
          },
        },
        grants: {
          include: {
            contributions: true,
          },
        },
      },
    });

    return this.calculateUserDonationMetrics(user);
  }
}
