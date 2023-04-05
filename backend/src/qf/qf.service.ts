import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PoolQfInformation } from './qf.interface';

@Injectable()
export class QfService {
  constructor(private readonly prismaService: PrismaService) {}

  async calculateQuadraticFundingAmount(matchingRoundId: string) {
    /**
     * We first need to get all the info of the matching round
     * 1. We need the amount of funds available
     * 2. We need the grants that these funds will be going to
     * 3. We need the contribution info from each grant too
     */
    const matchingRound = await this.prismaService.matchingRound.findUnique({
      where: {
        id: matchingRoundId,
      },
      include: {
        contributions: true, // Contributions to pool
        grants: {
          include: {
            contributions: true, // Contributions to grant
          },
        },
      },
    });

    // Here we get the total amount of funds in the matching pool
    const totalFundsInPool = matchingRound.contributions.reduce(
      (prev, matched) => prev + matched.amountUsd,
      0,
    );

    const qfInfo: PoolQfInformation = {
      grants: {},
      qfValues: {},
      sumOfQfValues: 0,
    };

    /**
     * We now get the information about all grants within the matching pool
     * The contributions for each grant have to be grouped by user ID
     */
    matchingRound.grants.forEach((grant) => {
      // We first need to group these contributions by user
      const grantContributionInfo = grant.contributions.reduce(
        (prev, contribution) => {
          if (!prev[contribution.userId])
            prev[contribution.userId] = {
              amountUsd: 0,
              qfValue: 0,
            };

          prev[contribution.userId].amountUsd += contribution.amountUsd;
          prev[contribution.userId].qfValue += Math.sqrt(
            contribution.amountUsd,
          );

          return prev;
        },
        {},
      );

      // Then now we can store the unique contributions under the grant
      qfInfo.grants[grant.id] = grantContributionInfo;
    });

    /**
     * Here is where the QF calculation is done
     * 1. We need to get the sum of square roots of each donation amount
     * 2. Then square it
     *
     * Important note: Contributions should be grouped by user
     */
    Object.keys(qfInfo.grants).forEach((grantId) => {
      const grant = qfInfo.grants[grantId];
      const qfValue = Object.keys(grant).reduce((prev, userId) => {
        return prev + grant[userId].qfValue;
      }, 0);
      const qfValueSquared = Math.pow(qfValue, 2);
      qfInfo.qfValues[grantId] = qfValueSquared;
      qfInfo.sumOfQfValues += qfValueSquared;
    });

    /**
     * Now that we have all of the QF values,
     * we can now calculate the amount of funds going to each grant
     */
    Object.keys(qfInfo.qfValues).map((grantId) => {
      const qfValue = qfInfo.qfValues[grantId];
      const qfPercentage = qfValue / qfInfo.sumOfQfValues;
      const qfAmount = qfPercentage * totalFundsInPool;
      console.log(
        `Grant: ${grantId} will be getting $${qfAmount} in matched funds!`,
      );
    });
  }
}
