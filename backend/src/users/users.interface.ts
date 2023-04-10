import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { UserProfileContributionInfo } from 'src/contributions/contributions.interface';
import { GrantResponseWithContributions } from 'src/grants/grants.interface';

/**
 * Typed interface for `@Request()` calls protected by NextAuthGuard
 * which includes `user`
 */
export interface RequestWithUser {
  user: User;
}

/**
 * Basic information about a User
 *
 * There are a few information that we hide from the users
 * 1. The visitorId
 * 2. Whether their account is flagged or not
 */
export class User {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  name: string;

  @ApiResponseProperty({
    type: String,
  })
  email: string;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  emailVerified: Date | null;

  @ApiResponseProperty({
    type: String,
  })
  image: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  bio: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  twitter: string | null;

  @Exclude()
  visitorId: string | null;

  @ApiResponseProperty({
    enum: Role,
  })
  role: Role;

  @Exclude()
  flagged: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

/**
 * Additional information that is returned when querying a UserProfile
 *
 * This includes information about their contributions, the grants they own,
 * the total amount donated & total amount raised
 */
export class UserProfile extends User {
  @ApiResponseProperty({
    type: [UserProfileContributionInfo],
  })
  @Type(() => UserProfileContributionInfo)
  contributions: UserProfileContributionInfo[];

  @ApiResponseProperty({
    type: [GrantResponseWithContributions],
  })
  @Type(() => GrantResponseWithContributions)
  grants: GrantResponseWithContributions[];

  @ApiResponseProperty({
    type: Number,
  })
  totalDonated: number;

  @ApiResponseProperty({
    type: Number,
  })
  totalRaised: number;

  constructor(partial: Partial<UserProfile>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * When updating a user, we only allow you to update your name, bio, and twitter handle for now
 */
export class UpdateUserDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  bio: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  twitter: string;
}
