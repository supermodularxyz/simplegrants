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
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
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
