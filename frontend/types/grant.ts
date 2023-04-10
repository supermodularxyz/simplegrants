import { PaymentAccount, PaymentProvider } from "@prisma/client";
import { Contribution } from "./contributions";
import { User } from "./user";

export interface BasicGrantResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  twitter: string;
  website: string;
  location: string;
  fundingGoal: number;
  verified: boolean;
}
export interface GrantResponse extends BasicGrantResponse {
  amountRaised: number;
  contributions: Contribution[];
  team: User[];
}

export interface GrantResponseWithContributions extends BasicGrantResponse {
  amountRaised: number;
  contributions: Contribution[];
}

export interface GrantDetailResponse extends GrantResponse {
  team: User[];
  contributions: Contribution[];
  paymentAccount: PaymentAccount & {
    provider: PaymentProvider;
  };
}

export const SortOptions = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Oldest",
    value: "oldest",
  },
  {
    label: "Most funded",
    value: "most_funded",
  },
  {
    label: "Most supporters",
    value: "most_backed",
  },
];

export const FilterOptions = [
  {
    label: "Funded",
    value: "funded",
  },
  {
    label: "Underfunded",
    value: "underfunded",
  },
];
