import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Contribution } from 'src/contributions/contributions.interface';
import { GrantResponse } from 'src/grants/grants.interface';

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

export enum FeeAllocationMethod {
  PASS_TO_CUSTOMER = 'customer',
  PASS_TO_POOL = 'pool',
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
 * Full pool details about a specific pool
 * This includes:
 * @param amountRaised Computed value of total amount raised in this pool
 * @param grants All grants in this pool
 */
export class PoolDetailResponse extends BasicPoolResponse {
  @ApiResponseProperty({
    type: Number,
  })
  amountRaised: number;

  @ApiResponseProperty({
    type: Number,
  })
  contributors: number;

  @ApiResponseProperty({
    type: [GrantResponse],
  })
  @Type(() => GrantResponse)
  grants: GrantResponse[];

  constructor(partial: Partial<PoolDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
