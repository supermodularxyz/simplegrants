import { Grant } from "@prisma/client";
import { BasicGrantResponse } from "./grant";

export interface UserProfileContributionInfo {
  id: string;
  amount: number;
  denomination: string;
  amountUsd: number;
  grantId: string | null;
  grant: BasicGrantResponse;
  totalMatched: number; // Computed info
  totalDonated: number; // Computed info
}

export interface Contribution {
  id: string;
  amount: number;
  denomination: string;
  amountUsd: number;
  grantId: string | null;
}
