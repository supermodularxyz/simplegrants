import { Grant } from "@prisma/client";
import { BasicGrantResponse } from "./grant";
import { MinimalPoolResponse } from "./pool";

export interface UserProfileDonationInfo {
  id: string;
  amount: number;
  denomination: string;
  amountUsd: number;
  grantId: string | null;
  grant: BasicGrantResponse;
  totalMatched: number; // Computed info
  totalDonated: number; // Computed info
}

export interface UserProfileContributionInfo {
  id: string;
  amount: number;
  denomination: string;
  amountUsd: number;
  matchingRoundId: string | null;
  matchingRound: MinimalPoolResponse;
}

export interface Contribution {
  id: string;
  amount: number;
  denomination: string;
  amountUsd: number;
  grantId: string | null;
}
