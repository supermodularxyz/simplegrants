import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { EcosystemBuilder } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Contribution } from 'src/contributions/contributions.interface';
import { PoolGrantResponse } from 'src/grants/grants.interface';
import { FeeAllocationMethod } from 'src/provider/provider.interface';
import { User } from 'src/users/users.interface';

export enum PoolSortOptions {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_FUNDED = 'most_funded',
  MOST_BACKED = 'most_backed',
}

export enum PoolFilterOptions {
  ENDED = 'ended',
  NOT_ENDED = 'not_ended',
}

/**
 * Used when searching/retrieving all pools
 */
export class GetPoolQueryDto {
  @ApiPropertyOptional({
    enum: PoolSortOptions,
  })
  @IsEnum(PoolSortOptions)
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    enum: PoolFilterOptions,
  })
  @IsEnum(PoolFilterOptions)
  @IsOptional()
  filter?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

/**
 * For the `getAllPools` function in `pool.service.ts`
 *
 * Controls whether we get all pools or verified pools only
 */
export class GetPoolDto extends GetPoolQueryDto {
  isVerified?: boolean;
}

/**
 * Data transfer object when creating a pool
 */
export class CreatePoolDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string | null;

  @ApiProperty({
    type: String,
  })
  @IsString()
  image: string | null;

  @ApiProperty({
    type: Date,
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: Date,
  })
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    type: [String],
  })
  @IsString({ each: true })
  @ArrayNotEmpty()
  grants: string[];
}

/**
 * Basic pool info which doesn't include nested objects
 *
 * Used in UserProfileContributionInfo and inherited classes
 */
export class BasicPoolResponse {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string | null;

  @ApiProperty({
    type: String,
  })
  @IsString()
  image: string | null;

  @ApiResponseProperty({
    type: Boolean,
  })
  paid: boolean;

  @ApiResponseProperty({
    type: Boolean,
  })
  verified: boolean;

  @Exclude()
  contributions: Contribution[];

  @ApiResponseProperty({
    type: Date,
  })
  startDate: Date;

  @ApiResponseProperty({
    type: Date,
  })
  endDate: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<BasicPoolResponse>) {
    Object.assign(this, partial);
  }
}

/**
 * Pool details about a specific pool
 * This includes:
 * @param amountRaised Computed value of total amount raised in this pool
 */
export class PoolResponse extends BasicPoolResponse {
  @ApiResponseProperty({
    type: Number,
  })
  amountRaised: number;

  constructor(partial: Partial<PoolResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * Minimal pool details about a specific pool
 *
 * This includes:
 * @param amountRaised Computed value of total amount raised in this pool
 */
export class MinimalPoolResponse {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string | null;

  @ApiProperty({
    type: String,
  })
  @IsString()
  image: string | null;

  @ApiResponseProperty({
    type: Boolean,
  })
  paid: boolean;

  @ApiResponseProperty({
    type: Boolean,
  })
  verified: boolean;

  @ApiResponseProperty({
    type: Date,
  })
  startDate: Date;

  @ApiResponseProperty({
    type: Date,
  })
  endDate: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<MinimalPoolResponse>) {
    Object.assign(this, partial);
  }
}

/**
 * Minimal pool details about a specific pool
 *
 * Used in User Profile
 *
 * This includes:
 * @param amountRaised Computed value of total amount raised in this pool
 */
export class UserProfilePoolResponse extends MinimalPoolResponse {
  @ApiResponseProperty({
    type: Number,
  })
  amountRaised: number;

  constructor(partial: Partial<UserProfilePoolResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * Full pool details about a specific pool
 * This includes:
 * @param amountRaised Computed value of total amount raised in this pool
 * @param team Team who created this pool
 * @param contributors Number of contributors in the pool
 * @param grants All grants in this pool
 */
export class PoolDetailResponse extends BasicPoolResponse {
  @ApiResponseProperty({
    type: Number,
  })
  amountRaised: number;

  @Exclude()
  funders: EcosystemBuilder[];

  @ApiResponseProperty({
    type: [User],
    example: [
      {
        id: 'clg5yxz390006rs0u6po4496g',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        emailVerified: null,
        image:
          'https://lh3.googleusercontent.com/a/HYholaWYk79ztL_n1_AfWAXyPSr8isJUg=s96-c',
        bio: 'Hello there',
        twitter: 'johndoe',
        role: 'User',
      },
    ],
  })
  @Type(() => User)
  team: User[];

  @ApiResponseProperty({
    type: Number,
  })
  contributors: number;

  @ApiResponseProperty({
    type: [PoolGrantResponse],
  })
  @Type(() => PoolGrantResponse)
  grants: PoolGrantResponse[];

  constructor(partial: Partial<PoolDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * Data transfer object when updating a pool
 *
 * @note - fundingGoal & paymentAccount is not allowed to be changed
 */
export class UpdatePoolDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string | null;

  @ApiProperty({
    type: String,
  })
  @IsString()
  image: string | null;

  @ApiProperty({
    type: Date,
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: Date,
  })
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    type: [String],
  })
  @IsString({ each: true })
  @ArrayNotEmpty()
  grants: string[];
}

/**
 * Helper class for pools checkout process
 */
export class PoolCheckout {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  amount: number;
}

/**
 * DTO for checking out one or more pools
 */
export class CheckoutPoolsDto {
  @ApiProperty({
    type: [PoolCheckout],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PoolCheckout)
  pools: PoolCheckout[];

  @ApiProperty({
    enum: FeeAllocationMethod,
  })
  @IsEnum(FeeAllocationMethod)
  @IsOptional()
  feeAllocation?: FeeAllocationMethod;
}

// TODO: Make it agnostic to whichever payment provider
export class CheckoutPoolsResponse {
  @ApiResponseProperty({
    type: String,
  })
  url: string;
}

/**
 * Additional computed amount field which is used when checking out
 */
export class PoolWithFunding {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  paid: boolean;
  verified: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
}
