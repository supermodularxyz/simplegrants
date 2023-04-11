import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { Grant, MatchedFund } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { HasMimeType, IsFile } from 'nestjs-form-data';
import { Contribution } from 'src/contributions/contributions.interface';
import { PaymentAccount } from 'src/payment-accounts/payment-accounts.interface';
import { User } from 'src/users/users.interface';

export enum GrantSortOptions {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  MOST_FUNDED = 'most_funded',
  MOST_BACKED = 'most_backed',
}

export enum GrantFilterOptions {
  FUNDED = 'funded',
  UNDERFUNDED = 'underfunded',
}

export enum FeeAllocationMethod {
  PASS_TO_CUSTOMER = 'customer',
  PASS_TO_GRANT = 'grant',
}

/**
 * Used when searching/retrieving all grants
 */
export class GetGrantQueryDto {
  @ApiPropertyOptional({
    enum: GrantSortOptions,
  })
  @IsEnum(GrantSortOptions)
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    enum: GrantFilterOptions,
  })
  @IsEnum(GrantFilterOptions)
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
 * For the `getAllGrants` function in `grants.service.ts`
 *
 * Controls whether we get all grants or verified grants only
 */
export class GetGrantDto extends GetGrantQueryDto {
  isVerified?: boolean;
}

/**
 * Information about `fileType`
 */
class FileTypeResult {
  @ApiProperty({
    type: String,
  })
  ext: string;

  @ApiProperty({
    type: String,
  })
  mime: string;
}

/**
 * This is the strucutre of a file sent over multipart/form-data
 */
class MemoryStoredFile {
  @ApiProperty({
    type: String,
  })
  originalName: string;

  @ApiProperty({
    type: String,
  })
  encoding: string;

  @ApiProperty({
    type: String,
  })
  busBoyMimeType: string;

  @ApiProperty({
    type: Buffer,
  })
  buffer: Buffer;

  @ApiProperty({
    type: Number,
  })
  size: number;

  @ApiProperty({
    type: FileTypeResult,
  })
  fileType: FileTypeResult;
}

/**
 * Data transfer object when updating a grant
 *
 * Every field is optional
 * @note - fundingGoal & paymentAccount is not allowed to be changed
 */
export class UpdateGrantDto {
  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({
    type: MemoryStoredFile,
    nullable: true,
  })
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'])
  @IsOptional()
  image?: any;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

/**
 * Data transfer object when creating a grant
 */
export class CreateGrantDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  location: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiProperty({
    type: String,
  })
  @IsUrl()
  website: string;

  @ApiProperty({
    type: MemoryStoredFile,
  })
  @IsFile()
  @HasMimeType(['image/jpeg', 'image/jpg', 'image/png'])
  image: any;

  @ApiProperty({
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: Number,
  })
  @Type(() => Number)
  @IsPositive()
  fundingGoal: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  paymentAccount: string;
}

/**
 * We extend UpdateGrantDto because there are fields that you may not need to update (such as images)
 */
export class ResubmitGrantDto extends UpdateGrantDto {
  @ApiProperty({
    type: Number,
  })
  @Type(() => Number)
  @IsPositive()
  fundingGoal: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  paymentAccount: string;
}

/**
 * Basic grant info which doesn't include nested objects
 *
 * Used in UserProfileContributionInfo and inherited classes
 */
export class BasicGrantResponse {
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
  description: string;

  @ApiResponseProperty({
    type: String,
  })
  image: string;

  @ApiResponseProperty({
    type: String,
  })
  twitter: string;

  @ApiResponseProperty({
    type: String,
  })
  website: string;

  @ApiResponseProperty({
    type: String,
  })
  location: string;

  @Exclude()
  paymentAccountId: string;

  @ApiResponseProperty({
    type: Number,
  })
  fundingGoal: number;

  @ApiResponseProperty({
    type: Boolean,
  })
  verified: boolean;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<BasicGrantResponse>) {
    Object.assign(this, partial);
  }
}

/**
 * Grant with matching info such as `matchedFund` & `contributions`
 *
 * Used for calculating QF amount
 */
export class GrantWithMatchingInfo extends BasicGrantResponse {
  @Exclude()
  matchedFund: MatchedFund[];

  @Exclude()
  contributions: Contribution[];

  constructor(partial: Partial<GrantWithMatchingInfo>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * Response body of a Grant, with additional information such as:
 *
 * @param amountRaised Computed value of all contributions under this grant
 * @param contributions Donations made to the grant
 */
export class GrantResponseWithContributions extends BasicGrantResponse {
  @ApiResponseProperty({
    type: Number,
  })
  amountRaised: number;

  @ApiResponseProperty({
    type: [Contribution],
    example: [
      {
        id: 'clg4zguz00089s5nndx5507js',
        amount: 1,
        denomination: 'USD',
        amountUsd: 1,
        grantId: 'clg3bs7400014x6s53234dnw2',
      },
      {
        id: 'clg4zguz0008as5nn9b536n6r',
        amount: 2,
        denomination: 'USD',
        amountUsd: 2,
        grantId: 'clg3bs7400014x6s53234dnw2',
      },
    ],
  })
  @Type(() => Contribution)
  contributions: Contribution[];

  constructor(partial: Partial<GrantResponseWithContributions>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * Response body of a Grant, with team info:
 *
 * @param team Users part of this grant's team
 */
export class GrantResponseWithTeam extends BasicGrantResponse {
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

  constructor(partial: Partial<GrantResponseWithTeam>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * Grant details about a specific grant
 * This includes:
 * @param team All users under this grant
 * @param contributions All donations to this grant
 */
export class GrantResponse extends BasicGrantResponse {
  @ApiResponseProperty({
    type: Number,
  })
  amountRaised: number;

  @ApiResponseProperty({
    type: [Contribution],
    example: [
      {
        id: 'clg4zguz00089s5nndx5507js',
        amount: 1,
        denomination: 'USD',
        amountUsd: 1,
        grantId: 'clg3bs7400014x6s53234dnw2',
      },
      {
        id: 'clg4zguz0008as5nn9b536n6r',
        amount: 2,
        denomination: 'USD',
        amountUsd: 2,
        grantId: 'clg3bs7400014x6s53234dnw2',
      },
    ],
  })
  @Type(() => Contribution)
  contributions: Contribution[];

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

  constructor(partial: Partial<GrantResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * Full grant details about a specific grant
 * This includes:
 * @param team All users under this grant
 * @param contributions All donations to this grant
 * @param paymentAccount The payment account info for this grant
 */
export class GrantDetailResponse extends BasicGrantResponse {
  @ApiResponseProperty({
    type: Number,
  })
  amountRaised: number;

  @ApiResponseProperty({
    type: [Contribution],
    example: [
      {
        id: 'clg4zguz00089s5nndx5507js',
        amount: 1,
        denomination: 'USD',
        amountUsd: 1,
        grantId: 'clg3bs7400014x6s53234dnw2',
      },
      {
        id: 'clg4zguz0008as5nn9b536n6r',
        amount: 2,
        denomination: 'USD',
        amountUsd: 2,
        grantId: 'clg3bs7400014x6s53234dnw2',
      },
    ],
  })
  @Type(() => Contribution)
  contributions: Contribution[];

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
    type: PaymentAccount,
  })
  @Type(() => PaymentAccount)
  paymentAccount: PaymentAccount;

  constructor(partial: Partial<GrantDetailResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * Helper class for grant checkout process
 */
export class GrantCheckout {
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
 * DTO for checking out one or more grants
 */
export class CheckoutGrantsDto {
  @ApiProperty({
    type: [GrantCheckout],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => GrantCheckout)
  grants: GrantCheckout[];

  @ApiProperty({
    enum: FeeAllocationMethod,
  })
  @IsEnum(FeeAllocationMethod)
  @IsOptional()
  feeAllocation?: FeeAllocationMethod;
}

// TODO: Make it agnostic to whichever payment provider
export class CheckoutGrantsResponse {
  @ApiResponseProperty({
    type: String,
  })
  url: string;
}

/**
 * Additional computed amount field which is used when checking out
 */
export type GrantWithFunding = Grant & {
  amount: number;
};
