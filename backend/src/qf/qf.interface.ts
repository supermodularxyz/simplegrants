export interface GrantContributionInformation {
  amountUsd: number;
  qfValue: number;
}

export interface GrantQfInformation {
  [grantId: string]: {
    [userId: string]: GrantContributionInformation;
  };
}

export interface GrantQfValues {
  [grantId: string]: number;
}

export interface PoolQfInformation {
  grants: GrantQfInformation;
  qfValues: GrantQfValues;
  sumOfQfValues: number;
}
