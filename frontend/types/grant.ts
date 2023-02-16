import { Contribution } from "./contributions";
import { UserProfile } from "./user";

export interface GrantResponse {
  id: string;
  name: string;
  description: string;
  image: string;
  twitter: string;
  website: string;
  location: string;
  paymentAccountId: string;
  fundingGoal: number;
  amountRaised: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrantDetailResponse extends GrantResponse {
  team: UserProfile[];
  contributions: Contribution[];
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
