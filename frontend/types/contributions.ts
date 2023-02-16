export interface Contribution {
  id: string;
  userId: string;
  amount: number;
  denomination: string;
  amountUsd: number;
  paymentMethodId: string;
  grantId: string | null;
  matchingRoundId: string | null;
  flagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}
