import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { BasicGrantResponse } from 'src/grants/grants.interface';
import { MinimalPoolResponse } from 'src/pool/pool.interface';

/**
 * Information about a specific contribution
 * This is used for API documentation and is exactly the same as the schema's contributions
 *
 * @note Grant information is not included in this! It is only the contribution
 */
export class Contribution {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @Exclude()
  userId: string;

  @ApiResponseProperty({
    type: Number,
  })
  amount: number;

  @ApiResponseProperty({
    type: String,
  })
  denomination: string;

  @ApiResponseProperty({
    type: Number,
  })
  amountUsd: number;

  @Exclude()
  paymentMethodId: string;

  @ApiResponseProperty({
    type: String,
  })
  grantId: string | null;

  @Exclude()
  matchingRoundId: string | null;

  @Exclude()
  flagged: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<Contribution>) {
    Object.assign(this, partial);
  }
}

/**
 * Donation info for user profile
 *
 * Includes `Grant` but shows minimal information, just enough for frontend rendering
 */
export class UserProfileDonationInfo {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: Number,
  })
  amount: number;

  @ApiResponseProperty({
    type: String,
  })
  denomination: string;

  @ApiResponseProperty({
    type: Number,
  })
  amountUsd: number;

  @ApiResponseProperty({
    type: String,
  })
  grantId: string | null;

  @ApiResponseProperty({
    type: BasicGrantResponse,
  })
  @Type(() => BasicGrantResponse)
  grant: BasicGrantResponse;

  @ApiResponseProperty({
    type: Number,
  })
  totalMatched: number;

  @ApiResponseProperty({
    type: Number,
  })
  totalDonated: number;

  @Exclude()
  userId: string;

  @Exclude()
  paymentMethodId: string;

  @Exclude()
  matchingRoundId: string | null;

  @Exclude()
  flagged: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserProfileDonationInfo>) {
    Object.assign(this, partial);
  }
}

/**
 * Pool contribution info for user profile
 *
 * Includes `MatchingRound` but shows minimal information, just enough for frontend rendering
 */
export class UserProfileContributionInfo {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: Number,
  })
  amount: number;

  @ApiResponseProperty({
    type: String,
  })
  denomination: string;

  @ApiResponseProperty({
    type: Number,
  })
  amountUsd: number;

  @Exclude()
  grantId: string;

  @Exclude()
  grant: any;

  @Exclude()
  userId: string;

  @Exclude()
  paymentMethodId: string;

  @ApiResponseProperty({
    type: String,
  })
  matchingRoundId: string | null;

  @ApiResponseProperty({
    type: MinimalPoolResponse,
  })
  @Type(() => MinimalPoolResponse)
  matchingRound: MinimalPoolResponse;

  @Exclude()
  flagged: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserProfileContributionInfo>) {
    Object.assign(this, partial);
  }
}
