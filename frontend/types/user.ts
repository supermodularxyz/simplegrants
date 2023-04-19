import { GrantResponseWithContributions } from "./grant";
import {
  UserProfileContributionInfo,
  UserProfileDonationInfo,
} from "./contributions";
import { Role } from "@prisma/client";
import { MinimalPoolResponse } from "./pool";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string;
  bio: string | null;
  twitter: string | null;
  role: Role;
}

export interface UserProfile extends User {
  donations: UserProfileDonationInfo[];
  grants: GrantResponseWithContributions[];
  contributions: UserProfileContributionInfo[];
  pools: MinimalPoolResponse[];
  totalDonated: number;
  totalRaised: number;
}
