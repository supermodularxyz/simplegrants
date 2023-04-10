import { GrantResponseWithContributions } from "./grant";
import { UserProfileContributionInfo } from "./contributions";
import { Role } from "@prisma/client";

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
  contributions: UserProfileContributionInfo[];
  grants: GrantResponseWithContributions[];
  totalDonated: number;
  totalRaised: number;
}
