import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PoolMatchInformation, PoolQfInformation } from './qf.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProviderService } from 'src/provider/provider.service';

@Injectable()
export class QfService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly providerService: ProviderService,
  ) {}

  private logger: LoggerService = new Logger(QfService.name);

  /**
   * Get the latest active matching round the grant is part of
   * @param grantId
   * @returns
   */
  async getActiveMatchingRoundByGrant(grantId: string) {
    const matchingRound = await this.prismaService.matchingRound.findFirst({
      where: {
        grants: {
          some: {
            id: grantId,
          },
        },
        endDate: {
          gte: new Date(),
        },
      },
    });

    return matchingRound;
  }

  async estimateMatchedAmount(donationAmount: number, grantId: string) {
    const matchingRound = await this.getActiveMatchingRoundByGrant(grantId);

    if (!matchingRound || donationAmount <= 0) return 0;

    const qfInfo = await this.calculateQuadraticFundingAmount(matchingRound.id);
    /**
     * We can estimate the QF amount by doing these steps:
     * 1. Square root the qfValue
     * 2. Square root the new donation amount
     * 3. Sum both these values together
     * 4. Square the value in step 3
     * 5. Calculate the difference
     * 6. Add the difference to the total qf value
     * 7. Multiply step 4 with total pool, divided by step 6
     * 8. Subtract with the original amount
     */
    const qfValue = qfInfo.grants[grantId].qfValue;
    const squared = Math.sqrt(qfValue) + Math.sqrt(donationAmount);
    const newQfValue = Math.pow(squared, 2);
    const difference = newQfValue - qfValue;
    const newDivisor = qfInfo.sumOfQfValues + difference;
    const newMatchedAmount =
      (qfInfo.totalFundsInPool * newQfValue) / newDivisor;
    const matchedAmountDifference =
      newMatchedAmount - qfInfo.grants[grantId].qfAmount;
    return matchedAmountDifference;
  }

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
            paymentAccount: true,
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
      recipients: {},
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
      qfInfo.recipients[grant.id] = grant.paymentAccount.recipientAddress;
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
    return Object.keys(qfInfo.qfValues).reduce(
      (prev, grantId) => {
        const grants = prev.grants;
        const qfValue = qfInfo.qfValues[grantId];
        const qfPercentage = qfValue / qfInfo.sumOfQfValues;
        const qfAmount = qfPercentage * totalFundsInPool;

        grants[grantId] = {
          qfValue,
          qfAmount,
          recipientAddress: qfInfo.recipients[grantId],
        };

        return {
          ...prev,
          grants,
          sumOfQfValues: qfInfo.sumOfQfValues,
          totalFundsInPool,
        };
      },
      {
        grants: {},
        sumOfQfValues: 0,
        totalFundsInPool: 0,
      } as PoolMatchInformation,
    );
  }

  @Cron(CronExpression.EVERY_HOUR)
  async distributeMatchedFunds() {
    // Find every ended pool
    const endedPools = await this.prismaService.matchingRound.findMany({
      where: {
        endDate: {
          lte: new Date(),
        },
        paid: false,
      },
    });

    this.logger.log(`${endedPools.length} pools found to process`);

    // Once we found a pool that has ended, we will need to calculate the qf amount
    for (let i = 0; i < endedPools.length; i++) {
      const pool = endedPools[i];
      const qfInfo = await this.calculateQuadraticFundingAmount(pool.id);

      // Within this pool, we now need to transfer the match amount to each grant & store the info
      // First, we set the pool as paid. This is an extra security step
      await this.prismaService.matchingRound.update({
        where: {
          id: pool.id,
        },
        data: {
          paid: true,
        },
      });

      // Payout funds
      const payoutPromise = Object.keys(qfInfo.grants).map(async (grantId) => {
        const info = qfInfo.grants[grantId];

        this.logger.log(
          `✈️ Sending ${info.qfAmount} to ${info.recipientAddress}...`,
        );

        // For each grant, we will get the payment account and initiate a fund transfer
        await this.providerService.initiateTransfer(
          info.recipientAddress,
          info.qfAmount,
        );

        this.logger.log(`✅ Funds sent to ${info.recipientAddress}`);

        // Once it is done, we return the info
        return {
          amount: info.qfAmount,
          denomination: 'USD',
          amountUsd: info.qfAmount,
          matchingRoundId: pool.id,
          grantId,
          payoutAt: new Date(),
        };
      });

      const promises = await Promise.allSettled(payoutPromise);

      // Only successful payouts are saved
      const payout = promises
        .filter((promise) => promise.status === 'fulfilled')
        .map((promise: PromiseFulfilledResult<any>) => promise.value);

      if (payout.length > 0) {
        // Save matched fund info
        await this.prismaService.matchedFund.createMany({
          data: payout,
        });

        this.logger.log(
          `🤑 Success! Paid out matching funds for pool ID: ${pool.id}`,
        );
      } else {
        this.logger.error(
          `❌ Failed! Unable to payout matching funds for pool ID: ${pool.id}`,
        );

        promises
          .filter((promise) => promise.status === 'rejected')
          .forEach((failed: PromiseRejectedResult) =>
            this.logger.error(failed.reason),
          );
      }
    }
  }
}
