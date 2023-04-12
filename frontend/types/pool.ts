export interface BasicPoolResponse {
  id: string;
  name: string;
  paid: boolean;
  verified: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface PoolResponse extends BasicPoolResponse {
  amountRaised: number;
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
    label: "Ended",
    value: "ended",
  },
  {
    label: "Not ended",
    value: "not_ended",
  },
];
