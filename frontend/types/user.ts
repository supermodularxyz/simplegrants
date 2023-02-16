import { Role } from "@prisma/client";
import { GrantResponse } from "./grant";
import { Contribution } from "./contributions";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string;
  bio: string | null;
  twitter: string | null;
  visitorId: string | null;
  role: Role;
  flagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  contributions: Contribution[];
  grants: GrantResponse[];
}
