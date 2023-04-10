/**
 * The amount contributed per unique user and the qfValue of each contribution
 * The qfValue is defined as the square root of the contribution amount
 *
 * This is used in the GrantQfInformation interface
 */
interface GrantContributionInformation {
  amountUsd: number;
  qfValue: number;
}

/**
 * The QF information for each unique grant
 *
 * For each unique grant, we map the contributions made by
 * unique users to their summed contributions + qfValue
 */
interface GrantQfInformation {
  [grantId: string]: {
    [userId: string]: GrantContributionInformation;
  };
}

/**
 * This just helps with calculations since it sums and squares the qfValues
 */
interface GrantQfValues {
  [grantId: string]: number;
}

/**
 * @param grants Information about each unique grant & their unique contributions
 * @param qfValues Each unique grant's QF values (already summed & squared)
 * @param sumOfQfValues This is our divisor
 */
export interface PoolQfInformation {
  grants: GrantQfInformation;
  qfValues: GrantQfValues;
  sumOfQfValues: number;
}
