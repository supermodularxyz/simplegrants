import { Grant } from "@prisma/client";
import { BasicGrantResponse } from "./grant";

export interface UserProfileContributionInfo {
  id: string;
  amount: number;
  denomination: string;
  amountUsd: number;
  grantId: string | null;
  grant: BasicGrantResponse;
}

export interface Contribution {
  id: string;
  amount: number;
  denomination: string;
  amountUsd: number;
  grantId: string | null;
}
